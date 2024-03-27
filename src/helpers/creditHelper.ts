import { CampaignService, TransactionLogService, TransactionService } from '../services';
import { ServiceEnum } from '../enums';
import { InputTransactionInterface, InputTransactionLogInterface, ModelsInterface } from '../interfaces';
import KSUID from 'ksuid';

class CreditHelper {
  private static instance: CreditHelper;

  private constructor() {}

  static get(): CreditHelper {
    if (!CreditHelper.instance) {
      CreditHelper.instance = new CreditHelper();
    }
    return CreditHelper.instance;
  }

  async getAvailableBalance({ workspaceId, service }: { workspaceId: number; service: ServiceEnum }): Promise<number> {
    const availableBalance: any = await new TransactionService().availableBalance({
      workspaceId: workspaceId,
      service: service,
    });
    const balance = availableBalance[0] ? availableBalance[0].dataValues.availableBalance : 0;
    if (balance <= 0) {
      return balance;
    }
    const lockedBalance: any = await new TransactionLogService().availableBalance({
      workspaceId: workspaceId,
      service: service,
    });
    const locked = lockedBalance[0] ? lockedBalance[0].dataValues.availableBalance : 0;

    return balance - locked;
  }

  async getAvailableServices({ workspaceId }: { workspaceId: number }): Promise<ServiceEnum[]> {
    const data: any = await new TransactionService().availableServices({
      workspaceId: workspaceId,
    });
    const availableServices : ServiceEnum[] = [];
    data.map((item: any) => {
      availableServices.push(item.service.slug)
    })

    return availableServices;
  }

  async lockBalance({
    workspaceId,
    service,
    userId,
    amount,
    campaignScheduleId,
    sanitizedEmailRegistryIds,
    batchSanitizeEmailRegistryGroupId,
  }: {
    workspaceId: number;
    service: ServiceEnum;
    userId: number;
    amount: number;
    campaignScheduleId?: number;
    sanitizedEmailRegistryIds?: number[];
    batchSanitizeEmailRegistryGroupId?: number;
  }) {
    let input: InputTransactionLogInterface = {
      workspaceId: workspaceId,
      amount: amount,
      service: service,
      transactionById: userId,
      batchSanitizeEmailRegistryGroupId: batchSanitizeEmailRegistryGroupId
    };
    if (campaignScheduleId) {
      input = {
        ...input,
        campaignScheduleId: campaignScheduleId,
      };
    }
    if (sanitizedEmailRegistryIds) {
      input = {
        ...input,
        sanitizedEmailRegistryIds: sanitizedEmailRegistryIds,
      };
    }
    try {
      console.info('INSIDE LOCK BALANCE : INPUT => ', input)
      const transactionLog = await new TransactionLogService().create(input);
      console.info('TRANSACTION LOG CREATED: =>',  transactionLog)
    } catch (error) {
      console.info('ERROR: =>', error)
    }
  }

  async unlockBalance({
    workspaceId,
    service,
    campaignScheduleId,
    batchSanitizeEmailRegistryGroupId
  }: {
    workspaceId: number;
    service: ServiceEnum;
    campaignScheduleId?: number;
    batchSanitizeEmailRegistryGroupId?: number;
  }) {
    let input: Partial<InputTransactionLogInterface> = {
      releaseBalance: true,
    };
    await new TransactionLogService().update({ input, workspaceId, service, campaignScheduleId, batchSanitizeEmailRegistryGroupId });
  }

  async deductBalance({
    workspaceId,
    creditTotal,
    service,
    userId,
    models,
    emailRegistryIds,
    campaignScheduleId,
  }: {
    workspaceId: number;
    creditTotal: number;
    service: ServiceEnum;
    userId: number;
    models: ModelsInterface,
    emailRegistryIds?: number[];
    campaignScheduleId?: number;
  }): Promise<boolean> {
    const balance = await this.getAvailableBalance({
      workspaceId: workspaceId,
      service: service,
    });
    if (balance >= creditTotal) {
      const transactionInput: InputTransactionInterface = {
        workspaceId: workspaceId,
        debit: creditTotal,
        service: service,
        transactionById: userId,
        transactionDate: new Date(),
        transactionCode: KSUID.randomSync().string,
        emailRegistryIds: emailRegistryIds,
        campaignScheduleId: campaignScheduleId
      };
      await new TransactionService(models).create(transactionInput);
      return true;
    } else {
      return false;
    }
  }

  async checkCampaignCredit({ campaignId, models }: { campaignId: number; models: ModelsInterface }): Promise<boolean> {
    const campaign = await new CampaignService(models).findByPk(campaignId);

    let messagingPlatforms = [campaign.schedule!.messagingPlatform!.slug];

    if (campaign.schedule?.fallbacks) {
      campaign.schedule.fallbacks.map((fallback) => messagingPlatforms.push(fallback.messagingPlatform!.slug));
    }
    let counts: Record<string, number> = {};
    let result: { [key: string]: number }[] = [];
    messagingPlatforms.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1;
    });
    messagingPlatforms.forEach((item) => {
      if (counts[item] > 0) {
        result.push({ [item]: counts[item] });
        counts[item] = 0;
      }
    });
    const promises = result.map(async (item) => {
      const balance = await this.getAvailableBalance({
        workspaceId: campaign.workspaceId,
        service: Object.keys(item)[0] as ServiceEnum,
      });
      if (balance < campaign.emailRegistryCampaigns!.length * item[Object.keys(item)[0]]) {
        return false;
      }
      return true;
    });

    const response = await Promise.all(promises);
    if (response.includes(false)) {
      return false;
    }

    return true;
  }
}

const creditHelper = CreditHelper.get();

export { creditHelper as CreditHelper };
