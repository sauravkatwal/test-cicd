import { Tenant } from '../middlewares';
import { RedisInstance } from '../config';
import { EmailRegistrySanitizedStatusEnum, ServiceEnum } from '../enums';
import { InputSanitizedNotificationInterface, InputTempSanitizeEmailRegistryInterface } from '../interfaces';
import {
  BatchSanitizeEmailRegistryGroupService,
  IORedisService,
  SanitizedNotificationService,
  TempSanitizeEmailRegistryService,
  WorkspaceService,
} from '../services';
import { Bouncer } from './bouncer';
import { CreditHelper } from '../helpers';

class NodeCron {
  private static instance: NodeCron;

  private constructor() { }

  static get(): NodeCron {
    if (!NodeCron.instance) {
      NodeCron.instance = new NodeCron();
    }
    return NodeCron.instance;
  }

  private async handleSanitizationCompleted({ key, status }: { key: string; status: any }) {
    try {
      const parsedValue = await RedisInstance.hGetAll({ key: key });
      const results = await Bouncer.getResults({ request_id: parsedValue.batchRequestId as string });
      const tempSanitizeEmailRegistries: InputTempSanitizeEmailRegistryInterface[] = results.data.map((item: any) => {
        const { email, status, reason, ...restSanitizedResponse } = item;
        return {
          email: item.email,
          sanitizedStatus: item.status,
          sanitizedReason: item.reason,
          sanitizedResponse: { reason, status, ...restSanitizedResponse },
          ...(item.status === EmailRegistrySanitizedStatusEnum.deliverable && {
            email_verified: true,
          }),
          workspaceId: Number(parsedValue.workspaceId),
        };
      });
      const notificationInput: InputSanitizedNotificationInterface = {
        workspaceId: Number(parsedValue.workspaceId),
        logs: [status.data],
      };
      const workspace = await new WorkspaceService().findByPk(Number(parsedValue.workspaceId));
      const models = await Tenant.connectTenantDB(workspace);
      await Promise.all([
        new TempSanitizeEmailRegistryService(models).bulkCreate(tempSanitizeEmailRegistries),
        new SanitizedNotificationService(models).create(notificationInput),
        new IORedisService().deleteBatchSanitizeCache(key!),
        new BatchSanitizeEmailRegistryGroupService(models).update(
          Number(parsedValue.batchRequestEmailRegistrySanitizeGroupId),
        ),
        CreditHelper.unlockBalance({
          workspaceId: workspace.id,
          service: ServiceEnum.bouncer,
          batchSanitizeEmailRegistryGroupId: Number(parsedValue.batchRequestEmailRegistrySanitizeGroupId)
        }),
        CreditHelper.deductBalance({
          workspaceId: workspace.id,
          creditTotal: tempSanitizeEmailRegistries.length,
          service: ServiceEnum.bouncer,
          userId: Number(parsedValue.userId),
          models: models,
        }),
      ]);

      const data = {
        message: 'Sanitization process completed',
        status: status.data.status,
        data: status.data.progress,
      };
      return data;
    } catch (error: any) {
      console.error(error);
      throw Error(error);
    }
  }

  async updateEmailRegistryStatus(): Promise<boolean> {
    const listLength = await RedisInstance.lLen({ key: 'list:usebouncer:queued' });
    if (listLength > 0) {
      for (let i = 0; i < listLength; i++) {
        try {
          const key = await RedisInstance.rPop({ key: 'list:usebouncer:queued' });
          const batchRequestId = await RedisInstance.hGet({ key: key!, field: 'batchRequestId' });
          const status = await Bouncer.checkStatus({ request_id: batchRequestId! });
          if (status.data.status === 'completed') {
            await this.handleSanitizationCompleted({ key: key!, status: status });
          } else {
            await RedisInstance.lPush({ key: 'list:usebouncer:queued', elements: key! });
          }
        } catch (error: any) {
          console.error(error);
          throw Error(error);
        }
      }
      return true;
    } else {
      return false;
    }
  }
}

const nodeCron = NodeCron.get();

export { nodeCron as NodeCron };
