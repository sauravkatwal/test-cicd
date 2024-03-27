// import { IoRedis } from "../config/ioredis";
import { InputSanitizationEmailRegistries } from '../interfaces'
class RedisProducer {
  private static instance: RedisProducer;

  private constructor() { }

  static get(): RedisProducer {
    if (!RedisProducer.instance) {
      RedisProducer.instance = new RedisProducer();
    }
    return RedisProducer.instance;
  }

  public publishSanitizationEmailRegistries(
    identity: string,
    data: InputSanitizationEmailRegistries 
  ): any {
    // return IoRedis.RedisIoRedis.publish(identity, {
    //   sanitizationEmailRegistries:data
    // });
    return 
  }
}

const redisProducer = RedisProducer.get();

export { redisProducer as RedisProducer };
