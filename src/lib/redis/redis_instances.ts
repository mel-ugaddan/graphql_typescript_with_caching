import { redis } from '@lib/redis';
import { RedisCache } from '@lib/redis';
import { REDIS_CACHE_PREFIX } from '@lib/constants';
import type { PostModel, UserModel } from '@lib/types';

export const userRedisCache = new RedisCache<UserModel>(redis, REDIS_CACHE_PREFIX.user);
export const postRedisCache = new RedisCache<PostModel>(redis, REDIS_CACHE_PREFIX.post);
