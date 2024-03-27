import { CredentialService } from '../services';
import { RedisInstance } from '../config';
import { Viber as ViberUtils } from '../utils'
import { MessagingPlatformEnum } from '../enums';
import { ModelsInterface } from '../interfaces';
class Viber {
  private static instance : Viber;

  private constructor() {};

  static get(): Viber {
    if (!Viber.instance) {
      Viber.instance = new Viber();
    }
    return Viber.instance;
  }

  public async getTokenFromCache(models: ModelsInterface) {
    const cacheExists = await RedisInstance.exists({ key: 'sparrowsms-viber-authorization'})
    if(cacheExists === 0) {
      const credentials = await new CredentialService(models).findOne({ isActive: true }, MessagingPlatformEnum.viber);
      const response = await ViberUtils.createJwtToken(credentials);
      const seconds = response.data.data.expires_in / 1000;
      await RedisInstance.set({
        key: 'sparrowsms-viber-authorization',
        input: response.data.data.token,
        seconds: Math.floor(seconds)
      })
    }

    return await RedisInstance.get({ key: 'sparrowsms-viber-authorization'})
  }
}

const viber = Viber.get();
export { viber as Viber };