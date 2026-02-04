import { redis } from '@lib/redis';
import { RedisCache } from '@lib/redis';
import { REDIS_CACHE_PREFIX } from '@lib/constants';

export type UserModel = {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
};

export async function setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<'OK'> {
  const payload = JSON.stringify(value);
  if (ttlSeconds) {
    return redis.set(key, payload, 'EX', ttlSeconds);
  }
  return redis.set(key, payload);
}

export async function getJson<T>(key: string): Promise<T | undefined> {
  const value = await redis.get(key); // string | null
  if (!value) return undefined; // ✅ handle missing key
  return JSON.parse(value) as T; // ✅ safe
}

async function main(): Promise<void> {
  const userclient = new RedisCache<UserModel>(redis, REDIS_CACHE_PREFIX.user);

  const user: UserModel = {
    id: 1,
    email: 'alice@example.com',
    name: 'Alice',
    role: 'admin',
  };

  await userclient.set(user.id, user);

  const cached_user1 = await await userclient.get(user.id);

  if (cached_user1) {
    console.log('User1:', cached_user1);
  } else {
    console.log('User1:', cached_user1);
  }

  const cached_user2 = await await userclient.get(2);

  if (cached_user2) {
    console.log('User2:', cached_user2);
  } else {
    console.log('User2:', cached_user2);
  }
}

main().then(async () => {
  await redis.quit();
});
