import * as Sequelize from 'sequelize';
import moment from 'moment-timezone';
import { WhereOptions } from 'sequelize';
import { MessagingPlatformEnum, SortEnum } from '../enums';
import { SequlizeQueryGenerator } from '../helpers';
import {
  ArgsCampaignInterface,
  CampaignInterface,
  EmailRegistryGroupInterface,
  EmailRegistryInterface,
  InputCampaignInterface,
  InputEmailRegistryCampaignInterface,
  ModelsInterface,
} from '../interfaces';

import {
  CampaignRepository,
  EmailRegistryCampaignRepository,
  EmailRegistryGroupRepository,
  EmailRegistryRepository,
  MessagingPlatformRepository,
} from '../repositories';
import { defaultCursor } from '../config';

export class CampaignService {
  private models: ModelsInterface;
  private repository: CampaignRepository;
  private emailRegistryCampaignRepository: EmailRegistryCampaignRepository;
  private emailRegistryRepository: EmailRegistryRepository;
  private emailRegistryGroupRepository: EmailRegistryGroupRepository;
  private messagingPlatformRepository: MessagingPlatformRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new CampaignRepository(this.models);
    this.emailRegistryRepository = new EmailRegistryRepository(this.models);
    this.emailRegistryGroupRepository = new EmailRegistryGroupRepository(this.models);
    this.messagingPlatformRepository = new MessagingPlatformRepository(this.models);
    this.emailRegistryCampaignRepository = new EmailRegistryCampaignRepository(this.models);
  }

  async create(input: InputCampaignInterface) {
    input.schedule.workspaceId = input.workspaceId;
    const emailRegistries: InputEmailRegistryCampaignInterface[] = [];
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
      timeZone: input.schedule.timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    if (
      new Date(`${input.schedule.scheduleDate}T${input.schedule.scheduleDate}`) <=
      new Date(dateTimeFormat.format(new Date()))
    ) {
      throw new Error('Please select a future date and time!');
    }
    const combinedDateTime = moment.tz(
      `${input.schedule.scheduleDate}T${input.schedule.scheduleTime}`,
      input.schedule.timeZone!,
    );
    const formattedUtcDateTime = combinedDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    input.schedule.scheduleDateTimeUtc = formattedUtcDateTime;

    if (input?.emailRegistryGroups?.length > 0) {
      const emailRegistryGroupExists = await this.emailRegistryGroupRepository.findAll({
        where: { id: { [Sequelize.Op.in]: input.emailRegistryGroups } },
        attributes: ['id'],
        include: [
          {
            model: this.models.EmailRegistry,
            as: 'emailRegistries',
            attributes: ['id'],
          },
        ],
      });

      if (emailRegistryGroupExists.length !== input.emailRegistryGroups.length)
        throw new Error('contain invalid Email Registry Group Id');

      emailRegistryGroupExists.map((element: EmailRegistryGroupInterface) => {
        element.emailRegistries?.map((item: EmailRegistryInterface) =>
          emailRegistries.push({ email_registry_id: item.id, email_registry_group_id: element.id }),
        );
      });
    }
    if (input?.emailRegistries?.length > 0) {
      const email_registry_ids = await this.emailRegistryRepository.findAll({
        where: { id: { [Sequelize.Op.in]: input.emailRegistries } },
        attributes: ['id'],
      });

      if (email_registry_ids.length !== input.emailRegistries.length)
        throw new Error('contain Invalid Email Registry Id');

      const emailRegistryCampaigns: InputEmailRegistryCampaignInterface[] = input.emailRegistries.map((item) => {
        return { email_registry_id: item };
      });
      emailRegistryCampaigns.map((item) => {
        emailRegistries.push(item);
      });
    }
    const messagingPlatform = await this.messagingPlatformRepository.findOne({
      where: { slug: input.schedule.messagingPlatform },
    });
    input.schedule.messagingPlatformId = messagingPlatform.id;
    if (input.schedule.fallbacks) {
      const response = input.schedule!.fallbacks!.map(async (item) => {
        item.workspaceId = input.workspaceId;
        const messagingPlatform = await this.messagingPlatformRepository.findOne({
          where: { slug: item.messagingPlatform },
        });
        item.timeZone = input.schedule.timeZone;
        const combinedDateTime = moment.tz(
          `${item.scheduleDate}T${item.scheduleTime}`,
          input.schedule.timeZone!,
        );
        const formattedUtcDateTime = combinedDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        item.scheduleDateTimeUtc = formattedUtcDateTime;
        item.messagingPlatformId = messagingPlatform.id;
        return item;
      });
      await Promise.all(response);
    }

    let result;
    try {
      result = await this.models.Campaign.sequelize!.transaction(async (transaction) => {
        const campaign = await this.repository.create(
          input,
          {
            include: [
              {
                model: this.models.CampaignSchedule,
                as: 'schedule',
                include: [
                  {
                    model: this.models.CampaignSchedule,
                    as: 'fallbacks',
                  },
                ],
              },
            ],
          },
          { transaction },
        );
        emailRegistries.map((item) => {
          item.campaign_id = campaign.id;
        });
        await this.emailRegistryCampaignRepository.bulkCreate(emailRegistries, { transaction });
        return campaign;
      });
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong!! Please try again');
    }
    return result;
  }

  async update(id: number, input: Partial<InputCampaignInterface>) {
    const updateCampaignInput = {
      name: input.name,
      description: input.description,
      replyEmail: input.replyEmail,
      plainText: input.plainText,
      query: input.query,
      trackingOpen: input.trackingOpen,
      trackingClick: input.trackingClick,
      isArchive: input.isArchive,
      subject: input.subject,
      approvedStatus: input.approvedStatus,
    };

    const [update] = await this.repository.updateOne({ id, input: updateCampaignInput });
    if (update === 0) throw new Error(`Campaign id: ${id} does not exist!`);
    return this.findByPk(id);
  }

  async updateOne({ id, input }: { id: number, input: Partial<InputCampaignInterface> }) {
    const [update] = await this.repository.updateOne({ id, input });
    if (update === 0) throw new Error(`Campaign Schedule: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }

  async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
    status,
    isArchive,
    workspaceId,
  }: ArgsCampaignInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: CampaignInterface[];
  }> {
    let where: WhereOptions<any> = {},
      cursorWhere: WhereOptions<any> = {},
      campaignScheduleWhere: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [],
      includeOptions: Sequelize.IncludeOptions[] = [];

    if (cursor) {
      if (cursorSort === SortEnum.desc) {
        cursorWhere = {
          ...cursorWhere,
          [defaultCursor]: { [Sequelize.Op.lt]: cursor },
        };
      } else {
        cursorWhere = {
          ...cursorWhere,
          [defaultCursor]: { [Sequelize.Op.gt]: cursor },
        };
      }
    }

    if (query) {
      where = {
        ...where,
        [Sequelize.Op.or]: SequlizeQueryGenerator.searchRegex({
          query,
          columns: ['name', 'description'],
        }),
      };
    }
    if (workspaceId) {
      where = { ...where, workspace_id: workspaceId };
    }
    if (status && status.length > 0) {
      campaignScheduleWhere = { ...campaignScheduleWhere, status: { [Sequelize.Op.in]: status } };
      includeOptions.push({
        model: this.models.CampaignSchedule,
        as: 'schedule',
        attributes: ['id', 'scheduleDate', 'scheduleTime', 'timeZone', 'status'],
        ...(Object.keys(campaignScheduleWhere).length > 0 && { where: campaignScheduleWhere }),
      });
    }

    if (typeof isArchive === 'boolean') {
      where = { ...where, is_archive: isArchive };
    }
    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }

    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }
    const [count, cursorCount, rows] = await Promise.all([
      this.repository.count({ where: where, distinct: true, include: includeOptions }),
      this.repository.count({ where: { ...cursorWhere, ...where }, distinct: true, include: includeOptions }),
      this.repository.findAll({
        where: { ...cursorWhere, ...where },
        limit,
        order: orderItem,
        include: [
          {
            model: this.models.CampaignSchedule,
            as: 'schedule',
            attributes: ['id', 'scheduleDate', 'scheduleTime', 'timeZone', 'status'],
            ...(Object.keys(campaignScheduleWhere).length > 0 && { where: campaignScheduleWhere }),
            include: [
              {
                model: this.models.MessagingPlatform,
                as: 'messagingPlatform',
                attributes: ['id', 'name', 'slug'],
              },
            ],
          },
        ],
      }),
    ]);

    return { count, cursorCount, rows };
  }

  async findByPk(id: number): Promise<CampaignInterface> {
    const [campaignExists, emailRegistryCampaigns] = await Promise.all([
      this.repository.findByPk(id, {
        include: [
          {
            model: this.models.CampaignSchedule,
            as: 'schedule',
            include: [
              {
                model: this.models.MessagingPlatform,
                as: 'messagingPlatform',
                attributes: ['id', 'name', 'slug'],
              },
              {
                model: this.models.EmailTemplate,
                as: 'template',
              },
              {
                model: this.models.CampaignSchedule,
                as: 'fallbacks',
                include: [
                  {
                    model: this.models.MessagingPlatform,
                    as: 'messagingPlatform',
                    attributes: ['id', 'name', 'slug'],
                  },
                  {
                    model: this.models.EmailTemplate,
                    as: 'template',
                  },
                ],
              },
            ],
          },
        ],
      }),
      this.emailRegistryCampaignRepository.findAll({
        where: {
          campaign_id: id
        },
        attributes: ['id', 'email_registry_id', 'campaign_id', 'email_registry_group_id'],
      })
    ]);

    if (!campaignExists) throw new Error(`Campaign: ${id} does not exist!`);
    campaignExists.emailRegistryCampaigns = emailRegistryCampaigns;
    return campaignExists;
  }

  async deleteOne(id: number) {
    const CampaignExists = await this.repository.findByPk(id);
    if (!CampaignExists) throw new Error(`Campaign: ${id} does not exist!`);
    if (!CampaignExists.isArchive) throw new Error(`Campaign: ${id} cannot be deleted!`);
    return this.repository.deleteOne(id);
  }

  async getCampaignEmailReportCount({
    campaignId,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<
    [
      {
        key: string;
        value: number;
      },
    ]
  > {
    const params = `:campaignId, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_campaign_email_report_count`,
      where: { campaignId, fromDate, toDate },
      params: params,
    });
  }
  async getEmailListsFromCampaignReport({
    campaignId,
    reportType,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    reportType: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<[any]> {
    const params = `:campaignId, :reportType, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_email_lists_from_campaign_report`,
      where: { campaignId, reportType, fromDate, toDate },
      params: params,
    });
  }

  async getCampaignReportTrackingCount({
    campaignId,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<[date: string, openCount: number, clickCount: number]> {
    const params = `:campaignId, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_campaign_report_tracking_count`,
      where: { campaignId, fromDate, toDate },
      params: params,
    });
  }

  async getCampaignReportTrackingList({
    campaignId,
    trackingType,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    trackingType: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<[any]> {
    const params = `:campaignId, :trackingType, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_email_lists_from_tracking`,
      where: { campaignId, trackingType, fromDate, toDate },
      params: params,
    });
  }

  async getCampaignReportFallbackCount({
    campaignId,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<[any]> {
    const params = `:campaignId, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_campaign_report_fallback_count`,
      where: { campaignId, fromDate, toDate },
      params: params,
    });
  }

  async getCampaignReportFallbackList({
    campaignId,
    fallbackLevel,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    fallbackLevel: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<[any]> {
    const params = `:campaignId, :fallbackLevel, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_email_lists_from_fallback`,
      where: { campaignId, fallbackLevel, fromDate, toDate },
      params: params,
    });
  }

  async getCampaignReportOverallCount({
    campaignId,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<[any]> {
    const params = `:campaignId, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_campaign_overall_report_count`,
      where: { campaignId, fromDate, toDate },
      params: params,
    });
  }

  async getCampaignReportReciepientCount({
    campaignId,
    fromDate,
    toDate,
    messagingPlatform,
  }: {
    campaignId: number;
    fromDate: Date;
    toDate: Date;
    messagingPlatform: MessagingPlatformEnum;
  }): Promise<[any]> {
    const params = `:campaignId, :messagingPlatform, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_campaign_recipient_report_count`,
      where: { campaignId, messagingPlatform, fromDate, toDate },
      params: params,
    });
  }

  async getCampaignReportReciepientList({
    campaignId,
    fromDate,
    toDate,
    reportType,
    messagingPlatform,
    query,
    offset,
    limit,
  }: {
    campaignId: number;
    fromDate: Date;
    toDate: Date;
    reportType: string;
    messagingPlatform: MessagingPlatformEnum;
    query: string;
    offset: number;
    limit: number;
  }): Promise<[any]> {
    const params = `:campaignId, :reportType, :messagingPlatform, :fromDate, :toDate, :query, :offset, :limit`;
    return this.repository.tenantDbQuery({
      functionName: `get_recipients_lists_from_campaign_report`,
      where: { campaignId, reportType, messagingPlatform, fromDate, toDate, query, offset, limit },
      params: params,
    });
  }

  async getEmailEngagementReportCount({
    campaignId,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<[any]> {
    const params = `:campaignId, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_email_engagement_report_count`,
      where: { campaignId, fromDate, toDate },
      params: params,
    });
  }

  async getWhatsappEngagementReportCount({
    campaignId,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<[any]> {
    const params = `:campaignId, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_whatsapp_engagement_report_count`,
      where: { campaignId, fromDate, toDate },
      params: params,
    });
  }

  async getViberEngagementReportCount({
    campaignId,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<[any]> {
    const params = `:campaignId, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_viber_engagement_report_count`,
      where: { campaignId, fromDate, toDate },
      params: params,
    });
  }

  async getSmsEngagementReportCount({
    campaignId,
    fromDate,
    toDate,
  }: {
    campaignId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<[any]> {
    const params = `:campaignId, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_sms_engagement_report_count`,
      where: { campaignId, fromDate, toDate },
      params: params,
    });
  }

  async getEmailEngagementReportList({
    campaignId,
    trackingType,
    fromDate,
    toDate,
    query,
    offset,
    limit,
  }: {
    campaignId: number;
    trackingType: string;
    fromDate: Date;
    toDate: Date;
    query: string;
    offset: number;
    limit: number;
  }): Promise<[any]> {
    const params = `:campaignId, :trackingType, :fromDate, :toDate, :query, :offset, :limit`;
    return this.repository.tenantDbQuery({
      functionName: `get_email_engagement_report_list`,
      where: { campaignId, trackingType, fromDate, toDate, query, offset, limit },
      params: params,
    });
  }

  async getWhatsappEngagementReportList({
    campaignId,
    trackingType,
    fromDate,
    toDate,
    query,
    offset,
    limit,
  }: {
    campaignId: number;
    trackingType: string;
    fromDate: Date;
    toDate: Date;
    query: string;
    offset: number;
    limit: number;
  }): Promise<[any]> {
    const params = `:campaignId, :trackingType, :fromDate, :toDate, :query, :offset, :limit`;
    return this.repository.tenantDbQuery({
      functionName: `get_whatsapp_engagement_report_list`,
      where: { campaignId, trackingType, fromDate, toDate, query, offset, limit },
      params: params,
    });
  }

  async getViberEngagementReportList({
    campaignId,
    trackingType,
    fromDate,
    toDate,
    query,
    offset,
    limit,
  }: {
    campaignId: number;
    trackingType: string;
    fromDate: Date;
    toDate: Date;
    query: string;
    offset: number;
    limit: number;
  }): Promise<[any]> {
    const params = `:campaignId, :trackingType, :fromDate, :toDate, :query, :offset, :limit`;
    return this.repository.tenantDbQuery({
      functionName: `get_viber_engagement_report_list`,
      where: { campaignId, trackingType, fromDate, toDate, query, offset, limit },
      params: params,
    });
  }

  async getSmsEngagementReportList({
    campaignId,
    trackingType,
    fromDate,
    toDate,
    query,
    offset,
    limit,
  }: {
    campaignId: number;
    trackingType: string;
    fromDate: Date;
    toDate: Date;
    query: string;
    offset: number;
    limit: number;
  }): Promise<[any]> {
    const params = `:campaignId, :trackingType, :fromDate, :toDate, :query, :offset, :limit`;
    return this.repository.tenantDbQuery({
      functionName: `get_sms_engagement_report_list`,
      where: { campaignId, trackingType, fromDate, toDate, query, offset, limit },
      params: params,
    });
  }
}
