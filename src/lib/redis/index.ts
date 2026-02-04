import 'dotenv/config';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  db: Number(process.env.REDIS_DB),

  // recommended defaults
  lazyConnect: true,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
});

export class RedisCache<T> {
  constructor(
    private readonly client: Redis,
    private readonly prefix: string
  ) {}

  private key(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<T | undefined> {
    const value = await this.client.get(this.key(key));
    if (!value) return undefined;
    return JSON.parse(value) as T;
  }

  async set(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    await this.client.set(this.key(key), serialized);
  }

  async setWithTTL(key: string, value: T, ttlSeconds: number): Promise<void> {
    const serialized = JSON.stringify(value);
    await this.client.set(this.key(key), serialized, 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.client.del(this.key(key));
  }
}

export { redis };
