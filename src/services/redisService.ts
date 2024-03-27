import { RedisInstance } from '../config';
import { InputCacheInterface } from '../interfaces';

export class RedisService {
  constructor() {}

  async create(input: InputCacheInterface) {
    const key = `from-${input.email}`;
    const cache = await RedisInstance.exists({ key })
    if( cache === 1 ) {
      return RedisInstance.jsonSet({ key, path: `$.${input.module}`, json: input.data })
    }
    return RedisInstance.jsonSet({ key, path: '.', json: {[input.module]: input.data}})
  }

  async remove(input: InputCacheInterface) {
    const key = `from-${input.email}`;
    const cache = await RedisInstance.exists({ key })
    if(cache) {
      return RedisInstance.jsonSet({ key, path: `$.${input.module}`, json: input.data || {} })
    }
  }

  async find(input: InputCacheInterface): Promise<any> {
    const key = `from-${input.email}`;
    const data = await RedisInstance.jsonGet({ key, options: { path: `$.${input.module}`} })
    if (!data) throw new Error('Invalid key');

    return data;
  }
}
