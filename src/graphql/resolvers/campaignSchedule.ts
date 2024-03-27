import { InformationEvent } from 'http';
import { MessagingPlatformEnum, ScheduleStatusEnum, CampaignTypeEnum, ServiceEnum } from '../../enums';
import { CreditHelper, SuccessResponse } from '../../helpers';
import { InBetweenDateExtend, ContextInterface } from '../../interfaces';
import { Guard } from '../../middlewares';
import { CampaignScheduleService, EmailRegistryCampaignService, IORedisService, MessagingPlatformService, RedisService } from '../../services';

export const campaignScheduleResolvers = {
  Mutation: {
    scheduleCampaign: async (
      parent: ParentNode,
      args: { campaignId: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      const isEnoughCredit = await CreditHelper.checkCampaignCredit({campaignId: args.campaignId, models: contextValue.models!});
      if(isEnoughCredit === false) {
        throw new Error(`Cannot Proceed with campaign schedule, You don't have enough credits!!`)
      }
      const data = await new CampaignScheduleService(contextValue.models!).updateOne(args.campaignId, ScheduleStatusEnum.scheduled);
      const customerCount = await new EmailRegistryCampaignService(contextValue.models!).count({ campaign_id: args.campaignId});
      const scheduleDateTime = new Date(data.scheduleDateTimeUtc!);
      const messagingPlatform = await new MessagingPlatformService(contextValue.models!).findByPk(data.messagingPlatformId!);

      switch (messagingPlatform.slug) {
        case MessagingPlatformEnum.email:
          await CreditHelper.lockBalance({
            workspaceId: workspace.id,
            service: ServiceEnum.email,
            userId: user.id,
            amount: customerCount,
            campaignScheduleId: data.id
          })
          await new IORedisService().createScheduleCache({
            campaignId: data.campaignId,
            scheduleDateTime: scheduleDateTime,
            workspaceId: workspace.id,
            scheduleId: data.id,
          });
          // await Schedule.campaignSchedule(scheduleDateTime, data.timeZone, data.campaignId);
          await Promise.all(
            data.fallbacks!.map(async (item) => {
              const platform = await new MessagingPlatformService(contextValue.models!).findByPk(item.messagingPlatformId!);
              let fallbackScheduleDateTime;
              if (platform.slug === MessagingPlatformEnum.email) {
                fallbackScheduleDateTime = new Date(item.scheduleDateTimeUtc!);
                await CreditHelper.lockBalance({
                  workspaceId: workspace.id,
                  service: ServiceEnum.email,
                  userId: user.id,
                  amount: customerCount,
                  campaignScheduleId: item.id
                });
                await new IORedisService().createScheduleCache({
                  campaignId: data.campaignId,
                  scheduleDateTime: fallbackScheduleDateTime,
                  workspaceId: workspace.id,
                  scheduleId: item.id,
                });
              }
              if (platform.slug === MessagingPlatformEnum.whatsapp) {
                fallbackScheduleDateTime = new Date(item.scheduleDateTimeUtc!);
                await CreditHelper.lockBalance({
                  workspaceId: workspace.id,
                  service: ServiceEnum.whatsapp,
                  userId: user.id,
                  amount: customerCount,
                  campaignScheduleId: item.id
                });
                await new IORedisService().createScheduleCache({
                  campaignId: data.campaignId,
                  scheduleDateTime: fallbackScheduleDateTime,
                  workspaceId: workspace.id,
                  scheduleId: item.id,
                });
              }
              if (platform.slug === MessagingPlatformEnum.viber) {
                fallbackScheduleDateTime = new Date(item.scheduleDateTimeUtc!);
                await CreditHelper.lockBalance({
                  workspaceId: workspace.id,
                  service: ServiceEnum.viber,
                  userId: user.id,
                  amount: customerCount,
                  campaignScheduleId: item.id
                });
                await new IORedisService().createScheduleCache({
                  campaignId: data.campaignId,
                  scheduleDateTime: fallbackScheduleDateTime,
                  workspaceId: workspace.id,
                  scheduleId: item.id,
                });
              }
              if (platform.slug === MessagingPlatformEnum.sms) {
                fallbackScheduleDateTime = new Date(item.scheduleDateTimeUtc!);
                await CreditHelper.lockBalance({
                  workspaceId: workspace.id,
                  service: ServiceEnum.sms,
                  userId: user.id,
                  amount: customerCount,
                  campaignScheduleId: item.id
                });
                await new IORedisService().createScheduleCache({
                  campaignId: data.campaignId,
                  scheduleDateTime: fallbackScheduleDateTime,
                  workspaceId: workspace.id,
                  scheduleId: item.id,
                });
              }
            }),
          );
          break;
        case MessagingPlatformEnum.viber:
          await CreditHelper.lockBalance({
            workspaceId: workspace.id,
            service: ServiceEnum.viber,
            userId: user.id,
            amount: customerCount,
            campaignScheduleId: data.id
          });
          await new IORedisService().createScheduleCache({
            campaignId: data.campaignId,
            scheduleDateTime: scheduleDateTime,
            workspaceId: workspace.id,
            scheduleId: data.id,
          });
          await Promise.all(
            data.fallbacks!.map(async (item) => {
              const platform = await new MessagingPlatformService(contextValue.models!).findByPk(item.messagingPlatformId!);
              let fallbackScheduleDateTime;
              if (platform.slug === MessagingPlatformEnum.sms) {
                fallbackScheduleDateTime = new Date(item.scheduleDateTimeUtc!);
                await CreditHelper.lockBalance({
                  workspaceId: workspace.id,
                  service: ServiceEnum.sms,
                  userId: user.id,
                  amount: customerCount,
                  campaignScheduleId: item.id
                });
                await new IORedisService().createScheduleCache({
                  campaignId: data.campaignId,
                  scheduleDateTime: fallbackScheduleDateTime,
                  workspaceId: workspace.id,
                  scheduleId: item.id,
                });
              }
            }),
          );
          break;
        case MessagingPlatformEnum.sms:
          await CreditHelper.lockBalance({
            workspaceId: workspace.id,
            service: ServiceEnum.sms,
            userId: user.id,
            amount: customerCount,
            campaignScheduleId: data.id
          });
          await new IORedisService().createScheduleCache({
            campaignId: data.campaignId,
            scheduleDateTime: scheduleDateTime,
            workspaceId: workspace.id,
            scheduleId: data.id,
          });
      }
      return SuccessResponse.send({
        message: 'Campaign Scheduled successfully!.',
        data: data,
      });
    },
  },
  Query: {
    campaignStatusCountSummaries: async (
      parent: ParentNode,
      args: InBetweenDateExtend,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      const draft = await new CampaignScheduleService(contextValue.models!).count({
        workspaceId: workspace.id,
        campaignStatus: ScheduleStatusEnum.draft,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const scheduled = await new CampaignScheduleService(contextValue.models!).count({
        workspaceId: workspace.id,
        campaignStatus: ScheduleStatusEnum.scheduled,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const completed = await new CampaignScheduleService(contextValue.models!).count({
        workspaceId: workspace.id,
        campaignStatus: ScheduleStatusEnum.completed,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const ongoing = await new CampaignScheduleService(contextValue.models!).count({
        workspaceId: workspace.id,
        campaignStatus: ScheduleStatusEnum.ongoing,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const failed = await new CampaignScheduleService(contextValue.models!).count({
        workspaceId: workspace.id,
        campaignStatus: ScheduleStatusEnum.failed,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });

      const response = [
        { status: ScheduleStatusEnum.scheduled, count: scheduled },
        { status: ScheduleStatusEnum.draft, count: draft },
        { status: ScheduleStatusEnum.ongoing, count: ongoing },
        { status: ScheduleStatusEnum.completed, count: completed },
        { status: ScheduleStatusEnum.failed, count: failed },
        { status: 'total', count: completed + draft + failed + ongoing + scheduled },
      ];

      return SuccessResponse.send({
        message: 'Campaign status count is successfully fetched.',
        data: response.map(({ status, count }) => ({ status: status, count: count })),
      });
    },
    campaignCountSummaries: async (
      parent: ParentNode,
      args: InBetweenDateExtend,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      const result = await new CampaignScheduleService(contextValue.models!).getCampaignTypeReportCount({
        workspaceId: workspace.id,
        fromDate,
        toDate,
      });
      const data = [
        {
          status: MessagingPlatformEnum.email,
          count: 0,
        },
        {
          status: MessagingPlatformEnum.whatsapp,
          count: 0,
        },
        {
          status: MessagingPlatformEnum.viber,
          count: 0,
        },
        {
          status: MessagingPlatformEnum.sms,
          count: 0,
        },
        {
          status: 'total',
          count: 0,
        },
      ];
      result.forEach((item) => {
        if (item.key === MessagingPlatformEnum.email) {
          data[0].count = Number(item.value);
        }
        if (item.key === MessagingPlatformEnum.whatsapp) {
          data[1].count = Number(item.value);
        }
        if (item.key === MessagingPlatformEnum.viber) {
          data[2].count = Number(item.value);
        }
        if (item.key === MessagingPlatformEnum.sms) {
          data[3].count = Number(item.value);
        }
        data[4].count = data[4].count + Number(item.value);
      });

      return SuccessResponse.send({
        message: 'Campaign count is successfully fetched.',
        data: data,
      });
    },
  },
};
