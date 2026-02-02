import userResolvers from './user.js';
import { postResolvers } from './post.js';
import type { Resolvers } from '@lib/types/generated/graphql/resolvers-types';

export const resolvers: Resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  },
};
