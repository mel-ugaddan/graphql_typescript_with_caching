import type { Resolvers } from '@lib/types/generated/graphql/resolvers-types';
import { ResolverUtils } from '@lib/utils/resolver';
import { ComposeResolver, ExceptionHandler } from '@lib/middlewares';
import { POST_RESOLVER_MESSAGES } from '@lib/constants';
import { UpdatePostInputSchema, CreatePostInputSchema } from '@lib/validations';

export const postResolvers: Resolvers = {
  Query: {
    post: ComposeResolver(
      async (_parent, args, context, info) => {
        let return_val = null;
        const post = await context.dataloaders.postLoader.load(args.id);
        if (!post) return null;
        const requested_fields = ResolverUtils.getRequestedFields(info);
        if (requested_fields.has('author')) {
          const author = await context.dataloaders.userLoader.load(post.authorId);
          return_val = { ...post, author: author };
          return ResolverUtils.formatResponse(return_val, POST_RESOLVER_MESSAGES.fetch_post_w_author_success);
        }
        return_val = { ...post };
        return ResolverUtils.formatResponse(return_val, POST_RESOLVER_MESSAGES.fetch_post_success);
      },
      [ExceptionHandler]
    ),
    posts: ComposeResolver(
      async (_parent, _args, context, info) => {
        let return_val;
        const requested_fields = ResolverUtils.getRequestedFields(info);
        const all_posts = await context.dataloaders.postLoader.getAll();
        if (requested_fields.has('author')) {
          const all_users = await context.dataloaders.userLoader.getAll();
          return_val = ResolverUtils.mapPostsWithAuthors(all_users, all_posts);
        }
        return ResolverUtils.formatResponse(return_val, POST_RESOLVER_MESSAGES.fetch_all_success);
      },
      [ExceptionHandler]
    ),
  },
  Mutation: {
    updatePost: ComposeResolver(
      async (_parent, { input }, context, _info) => {
        const validated_input = ResolverUtils.validateOrThrow(UpdatePostInputSchema, input);
        const { id, ...rest } = validated_input;
        const updated_post = await context.dataloaders.postLoader.updatePost(id, rest);
        return ResolverUtils.formatResponse(updated_post, POST_RESOLVER_MESSAGES.update_post_success);
      },
      [ExceptionHandler]
    ),
    createPost: ComposeResolver(
      async (_parent, { input }, context, _info) => {
        const validated_input = ResolverUtils.validateOrThrow(CreatePostInputSchema, input);
        const created_post = await context.dataloaders.postLoader.createPost(validated_input);
        return ResolverUtils.formatResponse(created_post, POST_RESOLVER_MESSAGES.create_post_success);
      },
      [ExceptionHandler]
    ),
    deletePost: ComposeResolver(
      async (_parent, { id }, context, _info) => {
        const deleted_post = await context.dataloaders.postLoader.deletePost(id);
        return ResolverUtils.formatResponse(deleted_post, POST_RESOLVER_MESSAGES.delete_post_success);
      },
      [ExceptionHandler]
    ),
  },
};
