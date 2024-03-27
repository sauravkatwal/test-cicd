import axios from 'axios';
import { viber as viberConfig } from '../config';
import { MethodEnum } from '../enums';
import { Viber as ViberHelper } from '../helpers';
import { CredentialInterface, InputSparrowViberMessage, ModelsInterface } from '../interfaces';

class Viber {
  private static instance: Viber;

  private constructor() {}

  static get(): Viber {
    if (!Viber.instance) {
      Viber.instance = new Viber();
    }
    return Viber.instance;
  }

  public async createJwtToken(credentials: CredentialInterface) {
    const api = this.createApi({});
    try {
      const payload = {
        api_token: credentials.secret.sparrowViberApiToken,
        partner_token: credentials.secret.sparrowViberPartnerToken,
      };
      const response = await api({
        method: MethodEnum.POST,
        url: `/autho/apitoken/login/`,
        data: payload,
      });
      return response;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  public async sendViberMessage(input: InputSparrowViberMessage, models: ModelsInterface) {
    const token = await ViberHelper.getTokenFromCache(models);
    const recipients = input.recipients.map((item) => {
      return item.split('+')[1];
    });
    const api = this.createApi({ authorization: token as string });
    const payload = {
      ...input.content,
      session: {
        sender_name: input.senderName,
        tag: ['tag1'],
        recipients: recipients,
      },
    };
    return api({
      method: MethodEnum.POST,
      url: `/viber/message/compose/`,
      data: payload,
    });
  }

  createApi({ authorization }: { authorization?: string }) {
    return axios.create({
      baseURL: viberConfig.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization ? `Bearer ${authorization}` : null,
      },
    });
  }
}

const viber = Viber.get();

export { viber as Viber };
