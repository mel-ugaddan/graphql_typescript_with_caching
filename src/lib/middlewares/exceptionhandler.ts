import type { ResolverFn } from '@lib/types/generated/graphql/resolvers-types';
import { GraphQLError } from 'graphql';
import { Prisma } from '@lib/types/generated/prisma/client';
import { REQUEST_MESSAGES } from '@lib/constants';
import { PRISMA_ERRORS } from '../constants';

/**
 * Higher-order resolver that standardizes GraphQL error handling.
 *
 * Wrapper for all of the resolver functions, a pattern that is used for
 * resolver authentication and error handling.
 */
export function ExceptionHandler<TResult, TParent, TContext, TArgs>(
  resolver: ResolverFn<TResult, TParent, TContext, TArgs>
): ResolverFn<TResult, TParent, TContext, TArgs> {
  return async (parent, args, context, info) => {
    try {
      return await resolver(parent, args, context, info);
    } catch (err) {
      if (err instanceof GraphQLError) {
        throw err;
      }

      if (err instanceof Error) {
        throw new GraphQLError(err.message, {
          extensions: { code: 'INTERNAL_SERVER_ERROR', messages: [REQUEST_MESSAGES.error_message] },
        });
      }

      throw new GraphQLError('Internal server error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR ', messages: [REQUEST_MESSAGES.error_message] },
      });
    }
  };
}

/**
 * Method decorator for dataloader for handling prisma errors.
 */
export function HandleErrors(): MethodDecorator {
  return function (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          const errorMessage = PRISMA_ERRORS[err.code];
          if (errorMessage) {
            throw new Error(errorMessage);
          }
        }
        throw err;
      }
    };
    return descriptor;
  };
}
