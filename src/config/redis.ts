import * as Redis from 'redis';

import { redisClient } from '../config';
import { RedisJSON } from '../interfaces';

class RedisInstance {
  private static instance: RedisInstance;
  private client: Redis.RedisClientType;

  private constructor() {
    this.client = Redis.createClient({
      url: `redis://${redisClient.host}:${redisClient.port}`,
      ...(redisClient.password && {
        password: redisClient.password,
      }),
      database: 0,
    });
  }

  static get(): RedisInstance {
    if (!RedisInstance.instance) {
      RedisInstance.instance = new RedisInstance();
    }

    return RedisInstance.instance;
  }

  public set({ key, input, seconds }: { key: string; input: string; seconds?: number }): Promise<string | null> {
    return this.client.set(key, input, {
      EX: seconds,
      NX: seconds ? true : undefined,
    });
  }

  public get({ key }: { key: string }): Promise<string | null> {
    return this.client.get(key);
  }

  public hSet({ key, value }: { key: string; value: { [x: string]: number | string } }): Promise<number> {
    return this.client.hSet(key, value);
  }

  public hGetAll({ key }: { key: string }): Promise<{ [x: string]: number | string }> {
    return this.client.hGetAll(key);
  }

  public hGet({ key, field }: { key: string; field: string }): Promise<string | undefined> {
    return this.client.hGet(key, field);
  }

  public del({ key }: { key: string }): Promise<number> {
    return this.client.del(key);
  }

  public type({ key }: { key: string }): Promise<string> {
    return this.client.type(key);
  }

  public exists({ key }: { key: string }): Promise<number> {
    return this.client.exists(key);
  }

  public lLen({ key }: { key: string }): Promise<number> {
    return this.client.lLen(key);
  }

  public jsonSet({ key, path, json }: { key: string; path: string; json: RedisJSON }): Promise<string | null> {
    return this.client.json.set(key, path, json);
  }

  public jsonGet({ key, options }: { key: string; options?: { path?: string } }): Promise<RedisJSON> {
    return this.client.json.get(key, options);
  }

  public lPush({ key, elements }: { key: string; elements: (string | Buffer) | Array<string | Buffer> }) {
    return this.client.lPush(key, elements);
  }

  public rPush({ key, elements }: { key: string; elements: (string | Buffer) | Array<string | Buffer> }) {
    return this.client.rPush(key, elements);
  }

  public lPop({ key }: { key: string }): Promise<string | null> {
    return this.client.lPop(key);
  }

  public rPop({ key }: { key: string }): Promise<string | null> {
    return this.client.rPop(key);
  }

  public lRange({ key, start, end }: { key: string; start: number; end: number }): Promise<string[]> {
    return this.client.lRange(key, start, end);
  }

  public async connection(): Promise<void> {
    try {
      await this.client.connect();
      console.info(`Redis is connected`);
    } catch (error: any) {
      console.error(error.message);
      throw Error(error.message);
    }
  }
}

const redisInstance = RedisInstance.get();

export { redisInstance as RedisInstance };
