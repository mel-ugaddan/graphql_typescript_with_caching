import type { ResolverFn } from '@lib/types/generated/graphql/resolvers-types';
export * from './exceptionhandler';

/**
 * Composes multiple middleware functions with a resolver
 * Middleware functions are applied in the order they appear in the array
 */
export function ComposeResolver<TResult = any, TParent = any, TContext = any, TArgs = any>(
  resolver: ResolverFn<TResult, TParent, TContext, TArgs>,
  middlewares: ((
    resolver: ResolverFn<TResult, TParent, TContext, TArgs>
  ) => ResolverFn<TResult, TParent, TContext, TArgs>)[]
): ResolverFn<TResult, TParent, TContext, TArgs> {
  return middlewares.reduceRight((acc, middleware) => middleware(acc), resolver);
}
