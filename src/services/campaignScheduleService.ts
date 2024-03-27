import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import moment from 'moment-timezone';

import {
  ArgsCampaignScheduleInterface,
  CampaignScheduleInterface,
  InputCampaignScheduleInterface,
  ModelsInterface,
} from '../interfaces';
import { CampaignScheduleRepository, MessagingPlatformRepository } from '../repositories';
import { ScheduleStatusEnum } from '../enums';

export class CampaignScheduleService {
  private models: ModelsInterface;
  private repository: CampaignScheduleRepository;
  private messagingPlatformRepository: MessagingPlatformRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new CampaignScheduleRepository(this.models);
    this.messagingPlatformRepository = new MessagingPlatformRepository(this.models);
  }

  async create(input: InputCampaignScheduleInterface) {
    const combinedDateTime = moment.tz(`${input.scheduleDate}T${input.scheduleTime}`, input.timeZone!);
    const formattedUtcDateTime = combinedDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    input.scheduleDateTimeUtc = formattedUtcDateTime;

    const messagingPlatform = await this.messagingPlatformRepository.findOne({
      where: { slug: input.messagingPlatform },
    });
    input.messagingPlatformId = messagingPlatform.id;

    if (input.fallbacks) {
      const response = input!.fallbacks!.map(async (item) => {
        item.workspaceId = input.workspaceId;
        const messagingPlatform = await this.messagingPlatformRepository.findOne({
          where: { slug: item.messagingPlatform },
        });
        item.timeZone = input.timeZone;
        const combinedDateTime = moment.tz(`${item.scheduleDate}T${item.scheduleTime}`, input.timeZone!);
        const formattedUtcDateTime = combinedDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        item.scheduleDateTimeUtc = formattedUtcDateTime;
        item.messagingPlatformId = messagingPlatform.id;
        return item;
      });
      await Promise.all(response);
    }

    return this.repository.create(input, {
      include: [
        {
          model: this.models.CampaignSchedule,
          as: 'fallbacks',
        },
      ],
    });
  }

  async updateOne(id: number, status: ScheduleStatusEnum): Promise<CampaignScheduleInterface> {
    const input = { status: status };
    const campaignScheduleExists: CampaignScheduleInterface = await this.repository.findOne({
      where: { campaignId: id },
    });
    if (!campaignScheduleExists) throw new Error(`Campaign Schedule: ${id} does not exist!`);
    id = campaignScheduleExists.id;
    const [update] = await this.repository.updateOne({ id, input });
    if (update === 0) throw new Error(`Campaign Schedule: ${id} does not exist!`);
    return await this.repository.findByPk(campaignScheduleExists.id, {
      include: [
        {
          model: this.models.CampaignSchedule,
          as: 'fallbacks',
          include: [
            {
              model: this.models.MessagingPlatform,
              as: 'messagingPlatform',
            },
          ],
        },
        {
          model: this.models.Campaign,
          as: 'campaign',
        },
      ],
    });
  }

  async updateMany({ where, input }: { where: WhereOptions<any>; input: InputCampaignScheduleInterface }) {
    const [update] = await this.repository.update({ where, input });
    return this.repository.findOne({ where });
  }

  async deleteOne(id: number): Promise<boolean> {
    const campaignScheduleExists = await this.repository.findByPk(id);
    if (!campaignScheduleExists) throw new Error(`campaign Schedule : ${id} does not exist!`);
    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Campaign Schedule: ${id} does not exist!`);
    return true;
  }

  async deleteMany({ campaignId }: Partial<ArgsCampaignScheduleInterface>) {
    let where: WhereOptions<any> = {};
    let deleteWhere: WhereOptions<any> = {};
    if (campaignId) {
      where = { ...where, campaignId };
    }
    const campaignScheduleExists = await this.repository.findOne({ where });
    if (campaignScheduleExists) {
      deleteWhere = { ...deleteWhere, [Sequelize.Op.or]: [{ campaignId }, { parentId: campaignScheduleExists.id }] };
    }

    return this.repository.deleteMany({ where: deleteWhere });
  }

  async findByPk(id: number): Promise<CampaignScheduleInterface> {
    const CampaignScheduleExists = await this.repository.findByPk(id, {
      include: [
        {
          model: this.models.CampaignSchedule,
          as: 'fallbacks',
          include: [
            {
              model: this.models.MessagingPlatform,
              as: 'messagingPlatform',
            },
            {
              model: this.models.EmailTemplate,
              as: 'template',
            },
          ],
        },
      ],
    });
    if (!CampaignScheduleExists) throw new Error(`Campaign Schedule: ${id} does not exist!`);

    return CampaignScheduleExists;
  }

  async count({
    workspaceId,
    campaignStatus,
    messagingPlatformId,
    fromDate,
    toDate,
  }: {
    workspaceId: number;
    campaignStatus?: ScheduleStatusEnum;
    messagingPlatformId?: number;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<number> {
    let where: WhereOptions<any> = {};
    if (workspaceId) {
      where = { ...where, workspace_id: workspaceId };
    }
    if (messagingPlatformId) {
      where = { ...where, messagingPlatformId: messagingPlatformId };
    }
    if (campaignStatus) {
      where = { ...where, status: campaignStatus };
    }
    if (fromDate && toDate) {
      where = { ...where, createdAt: { [Sequelize.Op.between]: [fromDate, toDate] } };
    }
    return this.repository.count({ where });
  }
  async getCampaignTypeReportCount({
    workspaceId,
    fromDate,
    toDate,
  }: {
    workspaceId: number;
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
    const params = `:workspaceId, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_campaign_type_report_count`,
      where: { workspaceId, fromDate, toDate },
      params: params,
    });
  }
}
