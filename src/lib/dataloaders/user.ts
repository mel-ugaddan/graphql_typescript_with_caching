import type { PrismaClient } from '@lib/types/generated/prisma/client';
import { LRUCache } from '@lib/cachemap/lru';
import { HandleErrors } from '@lib/middlewares';
import type { UserModelId, PrismaDelegates, UserSafeUpdateInput, UserSafeCreateInput, UserModel } from '@lib/types';

/**
 * User dataloader for CRUD Operations on both Cache and Prisma Client.
 */
export class UserDataLoader {
  protected cachemap: LRUCache<UserModelId, UserModel>;
  protected repository: PrismaDelegates['user'];
  protected prismaClient: PrismaClient;

  constructor(prisma: PrismaClient, cache: LRUCache<UserModelId, UserModel>) {
    this.repository = prisma.user;
    this.cachemap = cache;
    this.prismaClient = prisma;
  }

  /**
   * Get All Users.
   */
  @HandleErrors()
  async getAll(): Promise<UserModel[]> {
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
   * Get a single User using ID. Check if id exists from in-memory cache, if not, check database (hit database server).
   * If user does not exists, use negative caching
   */
  @HandleErrors()
  async load(id: UserModelId): Promise<UserModel | null> {
    if (this.cachemap.has(id)) {
      return this.cachemap.get(id)!;
    }

    const queried_item = await this.repository.findUnique({
      where: { id },
    });

    if (queried_item !== null) {
      this.cachemap.set(id, queried_item);
    }

    return queried_item;
  }

  /**
   * Create user then store them on cache
   */
  @HandleErrors()
  async createUser(input: UserSafeCreateInput): Promise<UserModel | null> {
    const created_result = await this.repository.create({
      data: input,
    });
    this.cachemap.set(created_result.id, created_result);
    return created_result;
  }

  /**
   * Delete user then invalidate on cache
   */
  @HandleErrors()
  async deleteUser(id: UserModelId): Promise<UserModel | null> {
    const query_result = await this.repository.delete({
      where: { id: id },
    });
    this.cachemap.delete(id);
    return query_result;
  }

  /**
   * Update user then update the user info from the cache.
   */
  @HandleErrors()
  async updateUser(id: UserModelId, input: UserSafeUpdateInput): Promise<UserModel | null> {
    const updated_result = await this.repository.update({
      where: { id },
      data: input,
    });

    this.cachemap.set(updated_result.id, updated_result);
    return updated_result;
  }
}
