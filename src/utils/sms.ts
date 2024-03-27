import axios, { AxiosResponse } from 'axios';
import { InputMessage } from '../interfaces';
import { MethodEnum } from '../enums';
import { sms } from '../config';

class SMS {
  private static instance: SMS;

  constructor() {}

  static get(): SMS {
    if (!SMS.instance) {
      SMS.instance = new SMS();
    }
    return SMS.instance;
  }

  async sendSMSMessage(input: InputMessage, token: string, from:string, baseUrl: string): Promise<AxiosResponse> {
    const api = this.createApi(baseUrl);

    try {
      const response = await api({
        method: MethodEnum.POST,
        url: `/sms/`,
        data: {
          token: token,
          from: from,
          to: input.reciepient,
          text: input.message,
        },
      });
      return response;
    } catch (error: any) {
      console.error(error.response.data);
      return error.response.data;
    }
  }

  createApi(baseUrl: string) {
    return axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

const Sms = SMS.get();

export { Sms as SMS };
