import type { UserModel } from '@lib/types/generated/prisma/models';
import { LRUCache, PostCache } from './lru';
import { USER_CACHE_LIMIT, POST_CACHE_LIMIT } from '@lib/constants';

export const userCache = new LRUCache<number, UserModel>(USER_CACHE_LIMIT);
export const postCache = new PostCache(POST_CACHE_LIMIT);
