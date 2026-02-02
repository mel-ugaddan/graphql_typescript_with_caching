import type { Resolvers } from '@lib/types/generated/graphql/resolvers-types';
import { ResolverUtils } from '@lib/utils/resolver';
import { ComposeResolver, ExceptionHandler } from '@lib/middlewares';
import { CreateUserInputSchema, UpdateUserInputSchema } from '@lib/validations';
import { USER_RESOLVER_MESSAGES } from '@lib/constants';

const userResolvers: Resolvers = {
  Query: {
    user: ComposeResolver(
      async (_parent, args, context, info) => {
        const user = await context.dataloaders.userLoader.load(args.id);
        if (!user) return null;
        const requested_fields = ResolverUtils.getRequestedFields(info);
        if (requested_fields.has('posts')) {
          const posts = await context.dataloaders.postLoader.getAllUserPosts(args.id);
          return ResolverUtils.formatResponse({ user, posts }, USER_RESOLVER_MESSAGES.fetch_user_w_posts_success);
        }
        return ResolverUtils.formatResponse({ user }, USER_RESOLVER_MESSAGES.fetch_user_success);
      },
      [ExceptionHandler]
    ),
    users: ComposeResolver(
      async (_parent, _args, context, info) => {
        const requested_fields = ResolverUtils.getRequestedFields(info);
        const all_users = await context.dataloaders.userLoader.getAll();
        if (requested_fields.has('posts')) {
          const all_posts = await context.dataloaders.postLoader.getAll();
          const users_with_posts = ResolverUtils.groupPostsByUser(all_users, all_posts);
          return ResolverUtils.formatResponse(users_with_posts, USER_RESOLVER_MESSAGES.fetch_all_w_posts_success);
        }
        const users_without_posts = all_users.map((user) => ({
          user,
        }));
        return ResolverUtils.formatResponse(users_without_posts, USER_RESOLVER_MESSAGES.fetch_all_success);
      },
      [ExceptionHandler]
    ),
  },
  Mutation: {
    createUser: ComposeResolver(
      async (_parent, { input }, context, _info) => {
        const validated_input = ResolverUtils.validateOrThrow(CreateUserInputSchema, input);
        const created_user = await context.dataloaders.userLoader.createUser(validated_input);
        return ResolverUtils.formatResponse(created_user, USER_RESOLVER_MESSAGES.create_user_success);
      },
      [ExceptionHandler]
    ),
    updateUser: ComposeResolver(
      async (_parent, { input }, context, _info) => {
        const validated_input = ResolverUtils.validateOrThrow(UpdateUserInputSchema, input);
        const { id, ...rest } = validated_input;
        const updated_user = await context.dataloaders.userLoader.updateUser(id, rest);
        return ResolverUtils.formatResponse(updated_user, USER_RESOLVER_MESSAGES.update_user_success);
      },
      [ExceptionHandler]
    ),
    deletePost: ComposeResolver(
      async (_parent, { id }, context, _info) => {
        const deleted_post = await context.dataloaders.userLoader.deleteUser(id);
        return ResolverUtils.formatResponse(deleted_post, USER_RESOLVER_MESSAGES.delete_user_success);
      },
      [ExceptionHandler]
    ),
  },
};
export default userResolvers;
