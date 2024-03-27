import { RedisInstance } from '../config';

export class IORedisService {
  constructor() {}

  async createBatchSanitizeCache({
    workspaceId,
    userId,
    batchRequestId,
    workspaceSecret,
    batchRequestEmailRegistrySanitizeGroupId,
  }: {
    workspaceId: number;
    userId: number;
    batchRequestId: string;
    workspaceSecret: string;
    batchRequestEmailRegistrySanitizeGroupId: number;
  }) {
    try {
      const key = `hash:usebouncer:${batchRequestId}`;
      const value = {
        workspaceId,
        userId,
        batchRequestId,
        workspaceSecret,
        batchRequestEmailRegistrySanitizeGroupId,
      };
      const [set, push] = await Promise.all([
        RedisInstance.hSet({ key, value }),
        RedisInstance.lPush({ key: 'list:usebouncer:queued', elements: key }),
      ]);

      console.info({ set, push });
    } catch (error: any) {
      console.error(error);
      throw Error(error);
    }
  }

  async createScheduleCache({
    campaignId,
    scheduleDateTime,
    workspaceId,
    scheduleId,
  }: {
    campaignId: number;
    scheduleDateTime: Date;
    workspaceId: number;
    scheduleId: number;
  }) {
    const key = `queue-campaign-${campaignId}-campaign-schedule-${scheduleId}-${workspaceId}`;
    const value = {
      campaignId,
      scheduleDateTime,
      workspaceId,
      scheduleId,
    };
    await RedisInstance.set({ key, input: JSON.stringify(value) });
  }

  deleteBatchSanitizeCache(key: string) {
    return RedisInstance.del({ key });
  }
}
