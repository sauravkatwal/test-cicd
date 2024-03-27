import axios, { AxiosResponse } from 'axios';
import { InputWhatsappMessageInterface, InputMessage } from '../interfaces';
import { MethodEnum } from '../enums';
import { whatsapp } from '../config';

class Whatsapp {
  private static instance: Whatsapp;

  constructor() {}

  static get(): Whatsapp {
    if (!Whatsapp.instance) {
      Whatsapp.instance = new Whatsapp();
    }
    return Whatsapp.instance;
  }

  getMessageInput = (input: { reciepient: string; message: any }): InputWhatsappMessageInterface => {
    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: input.reciepient,
      type: 'template',
      template: input.message.template,
    };
  };

  async sendWhatsappMessage(input: InputMessage): Promise<AxiosResponse> {
    const api = this.createApi();
    try {
      const data = this.getMessageInput(input);
      const response = await api({
        method: MethodEnum.POST,
        url: `/${whatsapp.versionNumber}/${whatsapp.phoneNumberId}/messages`,
        data: data,
      }); 
      return response.data;
    } catch (error : any) {
      console.error(error.response.data);
      return error.response;
    }
  }

  async getAllWhatsappTemplates(): Promise<AxiosResponse> {
    const api = this.createApi();

    try {
      const response = await api({
        method: MethodEnum.GET,
        url: `/${whatsapp.versionNumber}/${whatsapp.businessAccountId}/message_templates`,
      });
      return response.data;
    } catch (error: any) {
      console.error(error.response.data);
      return error.response.data;
    }
  }

  async getOneWhatsappTemplates({ name } : { name: string }): Promise<AxiosResponse> {
    const api = this.createApi();

    try {
      const response = await api({
        method: MethodEnum.GET,
        url: `/${whatsapp.versionNumber}/${whatsapp.businessAccountId}/message_templates?name=${name}`,
      });
      return response.data;
    } catch (error: any) {
      console.error(error.response.data);
      return error.response.data;
    }
  }

  async createWhatsappTemplate(input: {
    name: string;
    language: string;
    category: string;
    components: any;
  }): Promise<AxiosResponse> {
    const api = this.createApi();

    try {
      const response = await api({
        method: MethodEnum.POST,
        url: `/${whatsapp.versionNumber}/${whatsapp.businessAccountId}/message_templates`,
        data: input,
      });
      return response;
    } catch (error: any) {
      console.error(error.response.data);
      return error.response;
    }
  }

  async deleteWhatsappTemplate({ name } : { name: string }): Promise<AxiosResponse> {
    const api = this.createApi();

    try {
      const response = await api({
        method: MethodEnum.DELETE,
        url: `/${whatsapp.versionNumber}/${whatsapp.businessAccountId}/message_templates/${name}`,
      });
      return response.data;
    } catch (error: any) {
      console.error(error.response.data);
      return error.response.data;
    }
  }

  createApi() {
    return axios.create({
      baseURL: whatsapp.baseUrl,
      headers: {
        Authorization: `Bearer ${whatsapp.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
}

const whatsApp = Whatsapp.get();

export { whatsApp as Whatsapp };
