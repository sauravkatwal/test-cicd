import { PageInfoInterface } from '../interfaces';

class SuccessResponse {
  static instance: SuccessResponse;
  constructor() { }

  static get(): SuccessResponse {
    if (!SuccessResponse.instance) {
      SuccessResponse.instance = new SuccessResponse();
    }
    return SuccessResponse.instance;
  }

  async send({
    message,
    data,
    edges,
    pageInfo,
    count,
  }: {
    message: string;
    data?: Partial<any>;
    edges?: Partial<any>;
    count?: number;
    pageInfo?: PageInfoInterface;
  }) {
    return {
      message,
      data,
      edges,
      count,
      pageInfo,
    };
  }
}

const successResponse = SuccessResponse.get();

export { successResponse as SuccessResponse };
