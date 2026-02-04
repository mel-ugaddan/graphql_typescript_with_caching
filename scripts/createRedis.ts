import { redis } from '@lib/redis';

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
  const user: UserModel = {
    id: 1,
    email: 'alice@example.com',
    name: 'Alice',
    role: 'admin',
  };

  await setJson<UserModel>(`user:${user.id}`, user, 3600);

  const cached_user1 = await getJson<UserModel>(`user:${user.id}`);

  if (cached_user1) {
    console.log('User1:', cached_user1);
  } else {
    console.log('User1:', cached_user1);
  }

  const cached_user2 = await getJson<UserModel>(`user:${2}`);

  if (cached_user2) {
    console.log('User2:', cached_user2);
  } else {
    console.log('User2:', cached_user2);
  }
}

main().then(async () => {
  await redis.quit();
});
