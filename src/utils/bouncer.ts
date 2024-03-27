import axios, { AxiosResponse } from "axios";
import { bouncer } from "../config";
import { MethodEnum } from "../enums";
import {
  CheckStatusRequestBouncerInterface,
  CreateBatchRequestBouncerInterface,
  VerifyemailBouncerInterface,
} from "../interfaces";

class Bouncer {
  private static instance: Bouncer;

  private constructor() {}

  static get(): Bouncer {
    if (!Bouncer.instance) {
      Bouncer.instance = new Bouncer();
    }
    return Bouncer.instance;
  }

  verifyemail = ({
    email,
  }: VerifyemailBouncerInterface): Promise<AxiosResponse> => {
    const api = this.createApi();

    return api({
      url: "/v1/email/verify",
      method: MethodEnum.GET,
      params: {
        email: email,
        timeout: 10,
      },
    });
  };

  createBatchRequest = (
    input: CreateBatchRequestBouncerInterface[]
  ): Promise<AxiosResponse> => {
    const api = this.createApi();

    return api({
      url: "/v1/email/verify/batch",
      method: MethodEnum.POST,
      data: input,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  checkStatus = ({
    request_id,
  }: CheckStatusRequestBouncerInterface): Promise<AxiosResponse> => {
    const api = this.createApi();

    return api({
      url: `/v1/email/verify/batch/${request_id}/status`,
      method: MethodEnum.GET,
    });
  };

  checkCreditAvailable = (): Promise<AxiosResponse> => {
    const api = this.createApi();
    return api({
      url: '/v1.1/credits',
      method: MethodEnum.GET
    })
  }

  getResults = ({
    request_id,
  }: CheckStatusRequestBouncerInterface): Promise<AxiosResponse> => {
    const api = this.createApi();

    return api({
      url: `/v1/email/verify/batch/${request_id}`,
      method: MethodEnum.GET,
      params: {
        download: "all",
      },
    });
  };

  deleteRequest = ({
    request_id,
  }: CheckStatusRequestBouncerInterface): Promise<AxiosResponse> => {
    const api = this.createApi();

    return api({
      url: `v1/email/verify/batch/${request_id}`,
      method: MethodEnum.DELETE,
    });
  };

  createApi() {
    return axios.create({
      baseURL: bouncer.baseUrl,
      headers: {
        "x-api-key": bouncer.apiKey,
      },
    });
  }
}

const useBouncer = Bouncer.get();

export { useBouncer as Bouncer };
