export interface InputCacheInterface {
  email: string;
  module: string;
  data: RedisJSON;
}

export interface InputSanitizeCacheInterface {
  data: Object;
}

export interface RedisJSONArray extends Array<RedisJSON> {}

export interface RedisJSONObject {
  [key: string]: RedisJSON;
}

export declare type RedisJSON = null | boolean | number | string | Date | RedisJSONArray | RedisJSONObject;
