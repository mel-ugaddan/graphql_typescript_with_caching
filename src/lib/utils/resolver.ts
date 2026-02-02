import { GraphQLResolveInfo, FieldNode } from 'graphql';
import type { z } from 'zod';
import type { UserModel, UserModelId, PostModel } from '@lib/types';

export type ResolverResponse<T> = {
  result: T;
  success: boolean;
  message: string;
};

/**
 * GraphQL Helper:
 *
 * * getRequestedFields() - Extract requested fields from resolver info.
 * * validateOrThrow() - Zod Validation
 * * formatResponse() - Response Formatter
 * * groupPostsByUser(): Post[]  - Assigning `User` / Author to each `Posts`
 * * mapPostsWithAuthors(): User[] - Group `Posts` by `authorid` then assign to each `User`
 */
export class ResolverUtils {
  /**
   * Extract requested fields from resolver info : to reduce n+1 problem
   */
  static getRequestedFields(info: GraphQLResolveInfo, depth: number = 0): Set<string> {
    const fieldNode = info.fieldNodes[depth];

    if (!fieldNode?.selectionSet?.selections) {
      return new Set();
    }

    const fields = fieldNode.selectionSet.selections
      .filter((selection): selection is FieldNode => selection.kind === 'Field')
      .map((selection) => selection.name.value);

    return new Set(fields);
  }

  /**
   * Zod Validation, throw error if input does not met the criteria
   */
  static validateOrThrow<T extends z.ZodTypeAny>(schema: T, input: unknown): z.infer<T> {
    const result = schema.safeParse(input);

    if (!result.success) {
      throw new Error(`Validation failed: ${result.error.issues.map((e) => e.message).join(', ')}`);
    }

    return result.data;
  }

  /**
   * Format response to follow the {result: Object | null, message: string, status: boolean } format
   */
  static formatResponse<T>(result: T, message: string, success: boolean = true): ResolverResponse<T> {
    return {
      result,
      success,
      message,
    };
  }

  /**
   * Map posts to user list
   */
  static groupPostsByUser(users: UserModel[], posts: PostModel[]): Array<{ user: UserModel; posts: PostModel[] }> {
    const postsByAuthorId = posts.reduce<Record<UserModelId, PostModel[]>>((acc, post) => {
      (acc[post.authorId] ??= []).push(post);
      return acc;
    }, {});

    return users.map((user) => ({
      user,
      posts: postsByAuthorId[user.id] ?? [],
    }));
  }

  /**
   * Map user to post list
   */
  static mapPostsWithAuthors(users: UserModel[], posts: PostModel[]): Array<{ author: UserModel; post: PostModel }> {
    const usersById = users.reduce<Record<UserModelId, UserModel>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    return posts
      .map((post) => {
        const author = usersById[post.authorId];
        if (!author) return null;
        return { post, author };
      })
      .filter((item): item is { author: UserModel; post: PostModel } => item !== null);
  }
}
