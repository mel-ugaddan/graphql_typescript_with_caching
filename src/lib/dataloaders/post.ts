import { prisma } from '@lib/prisma';
import type { PrismaClient } from '@lib/types/generated/prisma/client';
import type {
  PostModelId,
  UserModelId,
  PrismaDelegates,
  PostModel,
  PostSafeUpdateInput,
  PostSafeCreateInput,
} from '@lib/types';
import { PostCache } from '@lib/cachemap/lru';
import { HandleErrors } from '@lib/middlewares';

/**
 * Post dataloader for CRUD Operations on both Cache and Prisma Client.
 */
export class PostDataLoader {
  protected cachemap: PostCache;
  protected repository: PrismaDelegates['post'];
  protected prismaClient: PrismaClient;

  constructor(prisma: PrismaClient, cache: PostCache) {
    this.repository = prisma.post;
    this.cachemap = cache;
    this.prismaClient = prisma;
  }

  /**
   * Retrieves all `Post` records, combining cached and uncached items,
   * and updates the cache with any newly fetched posts.
   */
  @HandleErrors()
  async getAll(): Promise<PostModel[]> {
    const cached_items = this.cachemap.getValues().filter((item) => item !== null);
    const cached_ids = this.cachemap.getIds();

    const uncached_items = await this.repository.findMany({
      where: { id: { notIn: cached_ids } },
    });

    const all_items = [...cached_items, ...uncached_items];

    all_items.forEach((item) => {
      this.cachemap.set(item.id, item);
    });

    return all_items;
  }

  /**
   * Get `Post` using parameter `id` then set on cache.
   */
  @HandleErrors()
  async load(id: PostModelId): Promise<PostModel | null> {
    if (this.cachemap.has(id)) return this.cachemap.get(id)!;

    const queried_item = await this.repository.findUnique({
      where: { id },
    });

    this.cachemap.set(id, queried_item);
    return queried_item;
  }

  /**
   * Updates a `Post` identified by `id` with the provided input data,
   * then updates the cache with the latest post data.
   */
  @HandleErrors()
  async updatePost(id: PostModelId, input: PostSafeUpdateInput): Promise<PostModel | null> {
    const updated = await this.repository.update({
      where: { id },
      data: input,
    });

    this.cachemap.set(updated.id, updated);
    return updated;
  }

  /**
   * Deletes a `Post` identified by `id` and removes it from the cache.
   */
  @HandleErrors()
  async deletePost(id: PostModelId): Promise<PostModel | null> {
    const delete_result = await this.repository.delete({ where: { id } });
    this.cachemap.delete(id);
    return delete_result;
  }

  /**
   * Creates a new `Post` with the provided input data
   * and adds it to the cache.
   */
  @HandleErrors()
  async createPost(input: PostSafeCreateInput): Promise<PostModel | null> {
    const created_result = await this.repository.create({
      data: input,
    });
    this.cachemap.set(created_result.id, created_result);
    return created_result;
  }

  /**
   * Retrieves all `Post` records for a specific user,
   * combining cached posts with any uncached posts from the database.
   */
  @HandleErrors()
  async getAllUserPosts(user_id: UserModelId): Promise<PostModel[]> {
    const { ids, values } = this.cachemap.getUserCachedPosts(user_id);
    const new_posts = await prisma.post.findMany({
      where: { id: { notIn: ids }, authorId: user_id },
    });
    return [...values, ...new_posts];
  }
}
