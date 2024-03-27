import {
  EmailRegistryCampaignReportStatusEnum,
  EmailRegistrySanitizedStatusEnum,
  MessagingPlatformEnum,
} from '../../enums';
import { InformationEvent } from 'http';
import { CursorPagination, SuccessResponse } from '../../helpers';
import { ArgsEmailRegistryCampaignInterface, ContextInterface, EmailRegistryCampaignInterface } from '../../interfaces';
import { Guard } from '../../middlewares';
import { CampaignService, EmailRegistryCampaignService } from '../../services';
import { defaultCursor } from '../../config';

export const emailRegistryCampaignResolvers = {
  Mutation: {},
  Query: {
    emailRegistryCampaignReport: async (
      parent: ParentNode,
      args: ArgsEmailRegistryCampaignInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      const { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });

      const { campaign_id, email_registry_group_id, email_registry_id, fromDate, toDate } = args;
      const { cursorCount, count, rows } = await new EmailRegistryCampaignService(contextValue.models!).findAndCountAll(
        {
          cursor,
          limit,
          order,
          sort,
          cursorSort,
          cursorOrder,
          query,
          campaign_id,
          email_registry_group_id,
          email_registry_id,
          fromDate,
          toDate,
        },
      );

      const campaign = await new CampaignService(contextValue.models!).findByPk(campaign_id!);
      const rowsFiltered = rows
        .map((item: EmailRegistryCampaignInterface) => {
          let status: string = '';
          if (item.email_registry) {
            if (campaign.schedule?.messagingPlatform?.slug === MessagingPlatformEnum.email) {
              if (item.email_registry.sanitizedStatus !== EmailRegistrySanitizedStatusEnum.deliverable) {
                status = EmailRegistryCampaignReportStatusEnum.bounced;
              } else if (item.aws_ses_message_id === null) {
                status = EmailRegistryCampaignReportStatusEnum.pending;
              } else {
                status = EmailRegistryCampaignReportStatusEnum.delivered;
              }
            } else if (campaign.schedule?.messagingPlatform?.slug === MessagingPlatformEnum.viber) {
              if (item.sparrowViberBatchId === null) {
                status = EmailRegistryCampaignReportStatusEnum.pending;
              } else {
                status = EmailRegistryCampaignReportStatusEnum.delivered;
              }
            } else if (campaign.schedule?.messagingPlatform?.slug === MessagingPlatformEnum.sms) {
              if (item.sparrowSmsMessageId === null) {
                status = EmailRegistryCampaignReportStatusEnum.pending;
              } else {
                status = EmailRegistryCampaignReportStatusEnum.delivered;
              }
            }
            return {
              email: item.email_registry.email,
              name: item.email_registry.name,
              phoneNumber: item.email_registry.phoneNumber,
              status: status,
              [defaultCursor]: item.id,
            };
          }
        })
        .filter((item) => item !== undefined);
      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows: rowsFiltered,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: 'Campaign Email Registry List is successfully fetched.',
        edges: data,
        pageInfo: pageInfo,
      });
    },
    campaignEmailRegistryGroupEmailRegistriesCount: async (
      parent: ParentNode,
      args: ArgsEmailRegistryCampaignInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      const { campaign_id, email_registry_group_id } = args;
      const count = await new EmailRegistryCampaignService(contextValue.models!).countGroupEmails({
        campaignId: campaign_id!,
        emailRegistryGroupId: email_registry_group_id!,
      });

      return SuccessResponse.send({
        message: 'Campaign email registry group email registries count fetched successfully!.',
        data: {
          count,
        },
      });
    },
  },
};
