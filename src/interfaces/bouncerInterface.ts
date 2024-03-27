export interface VerifyemailBouncerInterface {
  email: string;
}

export interface CreateBatchRequestBouncerInterface {
  name?: string;
  email: string;
}

export interface CheckStatusRequestBouncerInterface {
  request_id: string;
}

export interface RequestBouncerInterface {
  request_id: string;
}
