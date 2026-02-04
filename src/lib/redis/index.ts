import 'dotenv/config';
import Redis from 'ioredis';
import type { PostModelId, UserModelId } from '@lib/types';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  db: Number(process.env.REDIS_DB),

  // recommended defaults
  lazyConnect: true,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
});

export class RedisCache<T extends { id: PostModelId | UserModelId }> {
  constructor(
    private readonly client: Redis,
    private readonly prefix: string
  ) {}

  private key(key: T['id']): string {
    return `${this.prefix}:${String(key)}`;
  }

  async set(key: T['id'], value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    await this.client.set(this.key(key), serialized);
  }

  async get(key: T['id']): Promise<T | undefined> {
    const value = await this.client.get(this.key(key));
    if (!value) return undefined;
    return JSON.parse(value) as T;
  }

  async setWithTTL(key: T['id'], value: T, ttlSeconds: number): Promise<void> {
    const serialized = JSON.stringify(value);
    await this.client.set(this.key(key), serialized, 'EX', ttlSeconds);
  }

  async del(key: T['id']): Promise<void> {
    await this.client.del(this.key(key));
  }
}

export { redis };
