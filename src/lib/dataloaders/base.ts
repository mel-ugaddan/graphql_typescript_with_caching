import type { UserModel, PostModel } from '@lib/types/generated/prisma/models';
import type { PrismaClient, Prisma } from '@lib/types/generated/prisma/client';
import { LRUCache } from '@lib/cachemap/lru';

type PrismaDelegates = {
  post: Prisma.PostDelegate;
  user: Prisma.UserDelegate;
};

/**
 * @deprecated
 * This base class is deprecated due to insufficient type safety.
 *
 */
abstract class BaseDataLoader<T extends UserModel | PostModel, ModelName extends keyof PrismaDelegates> {
  protected cacheMap: LRUCache<number, T | null>;
  protected repository: PrismaDelegates[ModelName];

  constructor(repository: PrismaClient[ModelName], cache: LRUCache<number, T | null>) {
    this.repository = repository;
    this.cacheMap = cache;
  }

  async getAll(): Promise<T[]> {
    const cached_items = this.cacheMap.getValues().filter((item): item is T => item !== null);
    const cached_ids = this.cacheMap.getIds();

    const uncached_items = ((await this.repository) as any).findMany({
      where: { id: { notIn: cached_ids } },
    }) as T[];

    const all_items = [...cached_items, ...uncached_items];

    all_items.forEach((item) => {
      this.cacheMap.set(item.id, item);
    });

    return all_items;
  }

  async load(id: number): Promise<T | null> {
    if (this.cacheMap.has(id)) return this.cacheMap.get(id)!;

    const queried_item = await (this.repository as any).findUnique({
      where: { id },
    });

    this.cacheMap.set(id, queried_item);
    return queried_item;
  }

  async updateRecord(id: number, input: Partial<T>): Promise<T | null> {
    try {
      const exists = await (this.repository as any).findUnique({ where: { id } });

      if (!exists) {
        console.warn(`Record ${id} not found - skipping update`);
        return null;
      }

      const updated_result = await (this.repository as any).update({
        where: { id },
        data: input,
      });

      this.cacheMap.set(updated_result.id, updated_result);
      return updated_result;
    } catch (error) {
      console.error(`Error updating record with id ${id}:`, error);
      throw error;
    }
  }
}
