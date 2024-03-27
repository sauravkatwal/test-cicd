import { InformationEvent } from 'http';
import moment from 'moment-timezone';
import { CampaignApprovedStatus, EventEnum, MessagingPlatformEnum, ScheduleStatusEnum } from '../../enums';
import { Campaign, CursorPagination, SuccessResponse } from '../../helpers';
import {
  ArgsCampaignEmailReportCountInterface,
  ArgsCampaignInterface,
  CampaignInterface,
  ContextInterface,
  EmailRegistryCampaignInterface,
  InputCampaignInterface,
  InputEmailTemplateInterface,
  ReceiptInterface,
} from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import {
  CacheEmailTemplateService,
  CampaignScheduleService,
  CampaignService,
  EmailRegistryCampaignService,
} from '../../services';
import { RedisService } from '../../services/redisService';
import { createCampaign, updateCampaign, updateEmailTemplate } from '../../validators';
import { pgCampaignMaxLimit, pgMaxLimit, pgMinLimit } from '../../config';

export const campaignResolvers = {
  Mutation: {
    createCampaign: async (
      parent: ParentNode,
      args: { input: InputCampaignInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(createCampaign, args.input);
      args.input.workspaceId = workspace.id;

      const data = await new CampaignService(contextValue.models!).create(args.input);

      await new RedisService().remove({
        module: args.input.module,
        email: user.email,
        data: {}
      });

      return SuccessResponse.send({
        message: 'Campaign is successfully created.',
        data: data,
      });
    },
    updateCampaign: async (
      parent: ParentNode,
      args: { id: number; input: InputCampaignInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(updateCampaign, args.input);
      const data = await Campaign.updateCampaign(args.id, args.input, contextValue.models!);
      await new RedisService().remove({
        module: args.input.module,
        email: user.email,
        data: {}
      });
      return SuccessResponse.send({
        message: 'Campaign is successfully updated',
        data: data,
      });
    },
    deleteCampaign: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      await Promise.all([
        new CampaignService(contextValue.models!).deleteOne(args.id),
        new CampaignScheduleService(contextValue.models!).deleteMany({ campaignId: args.id }),
        new EmailRegistryCampaignService(contextValue.models!).deleteMany({ campaign_id: args.id }),
      ]);
      return SuccessResponse.send({
        message: 'Campaign is successfully deleted.',
      });
    },
    updateCampaignEmailTemplate: async (
      parent: ParentNode,
      args: { id: number; input: InputEmailTemplateInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(updateEmailTemplate, args.input);
      args.input.updated_by_id = user.id;
      const campaignData = await new CampaignService(contextValue.models!).findByPk(args.id);
      const cacheEmailTemplateId = campaignData.schedule!.cacheTemplateId;
      const data = await new CacheEmailTemplateService(contextValue.models!).updateOne(cacheEmailTemplateId, args.input);
      return SuccessResponse.send({
        message: 'Cache Email template is successfully updated.',
        data: data,
      });
    },
    approveCampaign: async (
      parent: ParentNode,
      args: { id: number; approvedStatus: CampaignApprovedStatus },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const data = await new CampaignService(contextValue.models!).updateOne({
        id: args.id,
        input: { approvedStatus: args.approvedStatus },
      });
      if(args.approvedStatus === CampaignApprovedStatus.rejected){
        await new CampaignScheduleService(contextValue.models!).updateOne(args.id, ScheduleStatusEnum.pending);
      }
      return SuccessResponse.send({
        message: `Campaign is ${args.approvedStatus} successfully updated.`,
        data: data,
      });
    }
  },
  Query: {
    campaigns: async (
      parent: ParentNode,
      args: ArgsCampaignInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      let { status, isArchive } = args;
      isArchive = typeof isArchive === 'boolean' ? isArchive : undefined;
      status = args.status;
      let { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });
      limit = limit && (limit > pgCampaignMaxLimit) ? pgCampaignMaxLimit : limit;  

      const { count, cursorCount, rows } = await new CampaignService(contextValue.models!).findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
        status,
        isArchive,
        workspaceId: workspace.id,
      });

      const responseMap = rows.map(async (item: CampaignInterface) => {
        const scheduleDateTime = `${item.schedule?.scheduleDate}T${item.schedule?.scheduleTime}`;
        const localCurrentDateTime = moment(new Date()).tz(`${item.schedule?.timeZone}`).format('YYYY-MM-DDTHH:mm:ss');

        if (item.schedule?.status === ScheduleStatusEnum.draft && scheduleDateTime <= localCurrentDateTime && item.isArchive === false) {
          await new CampaignService(contextValue.models!).updateOne({ id: item.id, input: { isArchive: true } });
          item.isArchive = true;
        }
        let campaign_id = item.id;

        const [emailRegistryCount, emailOpenCount, emailClickCount ] = await Promise.all([
          new EmailRegistryCampaignService(contextValue.models!).count({ campaign_id }),
          new EmailRegistryCampaignService(contextValue.models!).countEmailEvent({ campaign_id: campaign_id, event: EventEnum.open }),
          new EmailRegistryCampaignService(contextValue.models!).countEmailEvent({ campaign_id: campaign_id, event: EventEnum.click }),
        ])

        item.summary = {
          emailRegistryCount: emailRegistryCount,
          emailClickCount: emailClickCount,
          emailOpenCount: emailOpenCount,
        };
        return item;
      });

      const response = await Promise.all(responseMap);
      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows: response,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: 'Campaign list is successfully fetched.',
        edges: data,
        pageInfo: pageInfo,
      });
    },
    campaign: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const data = await new CampaignService(contextValue.models!).findByPk(args.id);
      const receipts: ReceiptInterface = {
        emailRegistries: [],
        emailRegistryGroups: [],
      };
      data.emailRegistryCampaigns?.forEach((item: EmailRegistryCampaignInterface) => {
        if (item.email_registry_group_id) {
          if (receipts.emailRegistryGroups.indexOf(item.email_registry_group_id) === -1)
            receipts.emailRegistryGroups.push(item.email_registry_group_id);
        } else {
          if (receipts.emailRegistryGroups.indexOf(item.email_registry_id) === -1)
            receipts.emailRegistries.push(item.email_registry_id);
        }
      });
      data.receipts = receipts;

      return SuccessResponse.send({
        message: 'Email registry details is successfully fetched.',
        data: data,
      });
    },
    campaignEmailReportCount: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { campaignId, fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());

      const result = await new CampaignService(contextValue.models!).getCampaignEmailReportCount({ campaignId, fromDate, toDate });
      const data: { [key: string]: number } = {};
      result.forEach((item) => {
        data[item.key] = Number(item.value);
      });
      return SuccessResponse.send({
        message: 'Email registry details is successfully fetched.',
        data: data,
      });
    },
    emailListFormCampaignReport: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { campaignId, reportType, fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      const result = await new CampaignService(contextValue.models!).getEmailListsFromCampaignReport({
        campaignId,
        reportType,
        fromDate,
        toDate,
      });

      return SuccessResponse.send({
        message: 'Email registry details is successfully fetched.',
        data: result,
      });
    },
    campaignReportTrackingCount: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { campaignId, fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());

      const result = await new CampaignService(contextValue.models!).getCampaignReportTrackingCount({ campaignId, fromDate, toDate });
      const outputArray = result.flatMap(({ date, open_count, click_count }: any) => [
        { date, key: 'openCount', value: open_count },
        { date, key: 'clickCount', value: click_count },
      ]);

      const response = {
        chart: outputArray,
        table: result,
      };
      return SuccessResponse.send({
        message: 'Campaign report tracking count is successfully fetched',
        data: response,
      });
    },
    campaignReportTrackingList: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { campaignId, fromDate, toDate, trackingType } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      trackingType = trackingType;

      const result = await new CampaignService(contextValue.models!).getCampaignReportTrackingList({
        campaignId,
        trackingType,
        fromDate,
        toDate,
      });

      return SuccessResponse.send({
        message: 'Campaign report tracking list is successfully fetched',
        data: result,
      });
    },
    campaignReportFallbackCount: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { campaignId, fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());

      const result = await new CampaignService(contextValue.models!).getCampaignReportFallbackCount({ campaignId, fromDate, toDate });

      const outputArray = result.flatMap(({ date, fallback1_counts, fallback2_counts }: any) => [
        { date, key: 'fallbackLevel1', value: fallback1_counts },
        { date, key: 'fallbackLevel2', value: fallback2_counts },
      ]);

      const response = {
        chart: outputArray,
        table: result,
      };
      return SuccessResponse.send({
        message: 'Campaign report fallback count is successfully fetched',
        data: response,
      });
    },
    campaignReportFallbackList: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { campaignId, fromDate, toDate, fallbackLevel } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      fallbackLevel = fallbackLevel;

      const result = await new CampaignService(contextValue.models!).getCampaignReportFallbackList({
        campaignId,
        fallbackLevel,
        fromDate,
        toDate,
      });
      return SuccessResponse.send({
        message: 'Campaign report fallback list is successfully fetched',
        data: result,
      });
    },
    campaignReportOverallCount: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { campaignId, fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());

      const result = await new CampaignService(contextValue.models!).getCampaignReportOverallCount({ campaignId, fromDate, toDate });

      return SuccessResponse.send({
        message: 'Campaign report overall count is successfully fetched',
        data: result,
      });
    },
    campaignReportReciepientCount: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { campaignId, messagingPlatform, fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());

      const result = await new CampaignService(contextValue.models!).getCampaignReportReciepientCount({ campaignId, messagingPlatform, fromDate, toDate });
      const data: { [key: string]: number } = {};
      result.forEach((item) => {
        data[item.key] = Number(item.value);
      });
      data.Sent = data.Sent + data.Bounced;

      return SuccessResponse.send({
        message: 'Campaign report reciepient count is successfully fetched',
      data: data,
      });
    },
    campaignReportReciepientList: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
     
      let { campaignId, reportType, messagingPlatform, fromDate, toDate, query, offset, limit } = args;
     
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      offset = offset && offset > 0 ? offset - 1 : 0;
      limit = limit ? limit : pgMinLimit;
      limit = Math.min(limit, pgMaxLimit);

      const result = await new CampaignService(contextValue.models!).getCampaignReportReciepientList({
        campaignId,
        reportType,
        fromDate,
        messagingPlatform,
        toDate,
        query,
        offset,
        limit,
      });

      return SuccessResponse.send({
        message: 'Email registry details is successfully fetched.',
        data: result,
      });
    },
    campaignReportEngagementCount: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { campaignId, messagingPlatform, fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      let result, outputArray;
      switch (messagingPlatform) {
        case MessagingPlatformEnum.email:
          result = await new CampaignService(contextValue.models!).getEmailEngagementReportCount({ campaignId, fromDate, toDate });
          outputArray = result.flatMap(({ date, open_count, click_count }: any) => [
            { date, key: 'openCount', value: open_count || 0},
            { date, key: 'clickCount', value: click_count || 0},
          ]);
          outputArray.unshift(
            { date: new Date(new Date(fromDate).setDate(new Date(fromDate).getDate() - 1)).toISOString().split('T')[0], key: 'openCount', value:  0},
            { date: new Date(new Date(fromDate).setDate(new Date(fromDate).getDate() - 1)).toISOString().split('T')[0], key: 'clickCount', value: 0},
          )
          break;
          case MessagingPlatformEnum.sms:
          result = await new CampaignService(contextValue.models!).getSmsEngagementReportCount({ campaignId, fromDate, toDate });
          outputArray = result.flatMap(({ date, delivery_count }: any) => [
            { date, key: 'deliveryCount', value: delivery_count || 0 },
          ]);
          outputArray.unshift(
            { date: new Date(new Date(fromDate).setDate(new Date(fromDate).getDate() - 1)).toISOString().split('T')[0], key: 'deliveryCount', value:  0},
          )
          break;
          case MessagingPlatformEnum.whatsapp:
          result = await new CampaignService(contextValue.models!).getWhatsappEngagementReportCount({ campaignId, fromDate, toDate });
          outputArray = result.flatMap(({ date, seen_count, delivery_count }: any) => [
            { date, key: 'deliveryCount', value: delivery_count || 0},
            { date, key: 'openCount', value: seen_count || 0 },
          ]);
          outputArray.unshift(
            { date: new Date(new Date(fromDate).setDate(new Date(fromDate).getDate() - 1)).toISOString().split('T')[0], key: 'deliveryCount', value:  0},
            { date: new Date(new Date(fromDate).setDate(new Date(fromDate).getDate() - 1)).toISOString().split('T')[0], key: 'openCount', value:  0},
          )
          break;
          case MessagingPlatformEnum.viber:
          result = await new CampaignService(contextValue.models!).getViberEngagementReportCount({ campaignId, fromDate, toDate });
          outputArray = result.flatMap(({ date, seen_count, delivery_count }: any) => [
            { date, key: 'deliveryCount', value: delivery_count || 0 },
            { date, key: 'openCount', value: seen_count || 0 },
          ]);
          outputArray.unshift(
            { date: new Date(new Date(fromDate).setDate(new Date(fromDate).getDate() - 1)).toISOString().split('T')[0], key: 'deliveryCount', value:  0},
            { date: new Date(new Date(fromDate).setDate(new Date(fromDate).getDate() - 1)).toISOString().split('T')[0], key: 'openCount', value:  0},
          )
          break;
        }
      const response = {
        chart: outputArray,
        table: result,
      };
      await Promise.all([response]);
      return SuccessResponse.send({
        message: 'Campaign engagement tracking count is successfully fetched',
        data: response,
      });
    },
    campaignReportEngagementList: async (
      parent: ParentNode,
      args: ArgsCampaignEmailReportCountInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      
      let { campaignId, trackingType, messagingPlatform, fromDate, toDate, query, offset, limit } = args;
      
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      offset = offset && offset > 0 ? offset - 1 : 0;
      limit = limit ? limit : pgMinLimit;
      limit = Math.min(limit, pgMaxLimit);
      
      let result;
      switch (messagingPlatform) {
        case MessagingPlatformEnum.email:
          result = await new CampaignService(contextValue.models!).getEmailEngagementReportList({ campaignId, trackingType, fromDate, toDate, query, offset, limit });
          break;
          case MessagingPlatformEnum.sms:
          result = await new CampaignService(contextValue.models!).getSmsEngagementReportList({ campaignId, trackingType, fromDate, toDate, query, offset, limit });
          break;
          case MessagingPlatformEnum.whatsapp:
          result = await new CampaignService(contextValue.models!).getWhatsappEngagementReportList({ campaignId, trackingType, fromDate, toDate, query, offset, limit });
          break;
          case MessagingPlatformEnum.viber:
          result = await new CampaignService(contextValue.models!).getViberEngagementReportList({ campaignId, trackingType, fromDate, toDate, query, offset, limit });
          break;
      }
      return SuccessResponse.send({
        message: 'Campaign engagement tracking list is successfully fetched',
        data: result,
      });
    },  },
};
