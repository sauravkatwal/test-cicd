import { AxiosResponse } from 'axios';
import {
  EmailRegistryBouncerStatusEnum,
  EmailRegistrySanitizedReasonEnum,
  EmailRegistrySanitizedStatusEnum,
  EmailRegistryStatusEnum,
  ServiceEnum,
} from '../enums';
import {
  TestEmailRegistryInterface,
  EmailRegistryInterface,
  RequestBouncerInterface,
  WorkspaceInterface,
  ModelsInterface
} from '../interfaces';
import {
  BatchSanitizeEmailRegistryGroupService,
  EmailRegistryService, IORedisService
} from '../services';
import { Bouncer } from '../utils';
import { CreditHelper } from './creditHelper';

class VerifyEmail {
  static instance: VerifyEmail;
  constructor() { }

  static get(): VerifyEmail {
    if (!VerifyEmail.instance) {
      VerifyEmail.instance = new VerifyEmail();
    }
    return VerifyEmail.instance;
  }

  async create({
    data,
    workspace,
  }: {
    data: EmailRegistryInterface[];
    workspace: WorkspaceInterface;
  }): Promise<RequestBouncerInterface> {
    const response = await Bouncer.createBatchRequest(data);
    const { requestId, status } = response.data;
    // await new EmailRegistryBouncerService().create({
    //   request_id: requestId,
    //   status: status,
    //   ids: data.map((item: EmailRegistryInterface) => item.id),
    //   workspace_id: workspace.id,
    //   response: response.data,
    // });

    return { request_id: requestId };
  }

  async checkStatus({ request_id }: RequestBouncerInterface): Promise<AxiosResponse> {
    let check: boolean = true;
    while (check) {
      const { data: checkStatus } = await Bouncer.checkStatus({
        request_id: request_id,
      });

      if (checkStatus.status === EmailRegistryBouncerStatusEnum.completed) {
        check = false;
      }
    }
    return Bouncer.getResults({
      request_id: request_id,
    });
  }

  async report({ response, request_id, models }: { response: AxiosResponse; request_id: string, models: ModelsInterface }) {
    let report = {
      deliverable: 0,
      risky: 0,
      undeliverable: 0,
      unknown: 0,
    };

    await Promise.all(
      response.data.map(
        (item: {
          email: string;
          status: EmailRegistrySanitizedStatusEnum;
          reason: EmailRegistrySanitizedReasonEnum;
        }) => {
          switch (item.status) {
            case EmailRegistrySanitizedStatusEnum.deliverable:
              report.deliverable = report.deliverable + 1;
              break;
            case EmailRegistrySanitizedStatusEnum.risky:
              report.risky = report.risky + 1;
              break;
            case EmailRegistrySanitizedStatusEnum.undeliverable:
              report.undeliverable = report.undeliverable + 1;
              break;
            case EmailRegistrySanitizedStatusEnum.unknown:
              report.unknown = report.unknown + 1;
              break;
            default:
              console.error('Invalid status');
          }
          const { email, reason, status, ...restSanitizedResponse } = item;
          return new EmailRegistryService(models).update(
            { email: item.email },
            {
              status: EmailRegistryStatusEnum.sanitized,
              sanitizedStatus: status,
              sanitizedReason: reason,
              sanitizedResponse: { reason, status, ...restSanitizedResponse },
              ...(item.status === EmailRegistrySanitizedStatusEnum.deliverable && {
                email_verified: true,
              }),
            },
          );
        },
      ),
    );

    Bouncer.deleteRequest({ request_id: request_id });
    return report;
  }

  verifyEmail({ emailRegistry }: { emailRegistry: EmailRegistryInterface }): Promise<AxiosResponse> {
    return Bouncer.verifyemail({
      email: emailRegistry.email,
    });
  }

  verifyTestEmail({ emailRegistry }: { emailRegistry: TestEmailRegistryInterface }): Promise<AxiosResponse> {
    return Bouncer.verifyemail({
      email: emailRegistry.email,
    });
  }

  async updateEmailRegistry({ id, response, models }: { id: number; response: AxiosResponse; models: ModelsInterface }): Promise<object> {
    const { email, reason, status, ...restSanitizedResponse } = response.data;
    await new EmailRegistryService(models).updateOne(id, {
      status: EmailRegistryStatusEnum.sanitized,
      sanitizedStatus: status,
      sanitizedReason: reason,
      sanitizedDate: new Date(),
      sanitizedResponse: { reason, status, ...restSanitizedResponse },
      ...(status === EmailRegistrySanitizedStatusEnum.deliverable && {
        email_verified: true,
      }),
    });

    return { [status]: 1 };
  }

  async verifyEmails({
    emailRegistries,
    userId,
    workspaceId,
    models,
    workspaceSecret,
    emailRegistryGroupId,
  }: {
    emailRegistries: EmailRegistryInterface[];
    userId: number;
    workspaceId: number;
    models: ModelsInterface;
    workspaceSecret: string;
    emailRegistryGroupId?: number
  }): Promise<object> {
    let report = {
      deliverable: 0,
      risky: 0,
      undeliverable: 0,
      unknown: 0,
    };
    const emails = emailRegistries.map((item) => ({ email: item.email, name: item.name }));
    const batchRequest = await Bouncer.createBatchRequest(emails);

    const input = {
      log: batchRequest.data as Object,
      emailRegistryGroupId: emailRegistryGroupId,
      emailRegistries: emailRegistries,
      batchRequestId: batchRequest.data.requestId as string,
      workspaceId: workspaceId,
      status: batchRequest.data.status as string,
    };
    const batchSanitizeEmailRegistryGroup = await new BatchSanitizeEmailRegistryGroupService(models).create(input);
    
    await CreditHelper.lockBalance({
      workspaceId: workspaceId,
      service: ServiceEnum.bouncer,
      userId: userId,
      amount: emails.length,
      batchSanitizeEmailRegistryGroupId: batchSanitizeEmailRegistryGroup.id,
    })
    await new IORedisService().createBatchSanitizeCache({
      batchRequestId: batchRequest.data.requestId,
      workspaceId: workspaceId,
      workspaceSecret: workspaceSecret,
      userId: userId,
      batchRequestEmailRegistrySanitizeGroupId: batchSanitizeEmailRegistryGroup.id,
    });
    const sanitizeEmails: string[] = emailRegistries.map((item) => (item.email));
    await new EmailRegistryService(models).updateBulkDate({ emails: sanitizeEmails });
    return report;
  }
}

const verifyEmail = VerifyEmail.get();

export { verifyEmail as VerifyEmail };
