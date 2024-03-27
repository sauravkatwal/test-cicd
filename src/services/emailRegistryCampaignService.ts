
import { defaultCursor } from '../config';
import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { SortEnum } from '../enums';
import { SequlizeQueryGenerator } from '../helpers';
import {
  ArgsEmailRegistryCampaignInterface,
  EmailRegistryCampaignInterface,
  InputEmailRegistryCampaignInterface,
  ModelsInterface,
} from '../interfaces';
import { EmailRegistryCampaignRepository } from '../repositories';
export class EmailRegistryCampaignService {
  private models: ModelsInterface;
  private repository: EmailRegistryCampaignRepository;

  constructor(models: ModelsInterface) {
    this.models = models!
    this.repository = new EmailRegistryCampaignRepository(this.models);
  }

  async bulkCreate(input: InputEmailRegistryCampaignInterface[]) {
    this.repository.bulkCreate(input);
  }

  async deleteMany({ campaign_id }: { campaign_id: number }) {
    let where: WhereOptions<any> = {};
    if (campaign_id) {
      where = { ...where, campaign_id };
    }
    const emailRegistryCampaignExists = await this.repository.findOne({ where });
    if (!emailRegistryCampaignExists) return;
    return this.repository.deleteMany({ where });
  }

  async update(id: number, input: Partial<InputEmailRegistryCampaignInterface>) {
    const [update] = await this.repository.updateOne({
      id,
      input,
    });
    if (update === 0) throw new Error(`Email registry Campaign: ${id} does not exist!`);
    return this.repository.findByPk(id, {
      include: [
        {
          model: this.models.Campaign,
          as: 'campaign',
          attributes: ['workspaceId']
        },
      ]
    });
  }

  async count({
    campaign_id,
    has_email_clicked,
    has_email_open,
  }: {
    campaign_id?: number;
    has_email_clicked?: boolean;
    has_email_open?: boolean;
  }): Promise<number> {
    let where: WhereOptions<any> = {};
    if (campaign_id) {
      where = { ...where, campaign_id };
    }
    if (has_email_clicked) {
      where = { ...where, has_email_clicked };
    }
    if (has_email_open) {
      where = { ...where, has_email_open };
    }

    return this.repository.count({
      where,
    });
  }

  async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
    campaign_id,
    email_registry_group_id,
    email_registry_id,
    fromDate,
    toDate,
  }: ArgsEmailRegistryCampaignInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: EmailRegistryCampaignInterface[];
  }> {
    let where: WhereOptions<any> = {},
      cursorWhere: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];

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
        [Sequelize.Op.or]:
          SequlizeQueryGenerator.searchRegex({
            query,
            columns: ['label'],
          }),
      };
    }

    if (campaign_id) {
      where = { ...where, campaign_id };
    }
    if (email_registry_group_id) {
      where = { ...where, email_registry_group_id };
    }

    if (email_registry_id) {
      where = { ...where, email_registry_id };
    }

    if(fromDate && toDate) {
      where = { ...where, createdAt: { [Sequelize.Op.between]: [fromDate, toDate] } };
    }
    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }
    
    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }
    const [count, cursorCount, rows] = await Promise.all([
      this.repository.count({ where: where }),
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.findAll({
        where: { ...cursorWhere, ...where },
        limit,
        order: orderItem,
        include: [
          {
            model: this.models.EmailRegistry,
            as: 'email_registry',
          },
          {
            model: this.models.CampaignClickEvent,
            as: 'campaignClickEvents'
          }
        ],
      }),
    ]);

    return { rows, count, cursorCount };
  }

  async findOne({
    id,
    email_registry_id,
    campaign_id,
  }: {
    id?: number;
    email_registry_id?: number;
    campaign_id?: number;
  }): Promise<EmailRegistryCampaignInterface> {
    let where: WhereOptions<any> = {};
    if (email_registry_id && campaign_id) {
      where = { ...where, email_registry_id, campaign_id };
    }
    if (id) {
      where = { ...where, id };
    }
    const EmailRegistryCampaignExists = await this.repository.findOne({
      where: { ...where },
    });
    if (!EmailRegistryCampaignExists) throw new Error(`Campaign does not exist!`);

    return EmailRegistryCampaignExists;
  }

  async findAll({
    campaign_id,
    event
  }: {
    campaign_id: number,
    event: string
  }): Promise<EmailRegistryCampaignInterface[]> {
    let eventWhere: WhereOptions<any> = {};
    if (event) {
      eventWhere = {
        event: event
      }
    }

    return await this.repository.findAll({
      include: [
        {
          model: this.models.CampaignClickEvent,
          as: 'campaignClickEvents',
          ...(Object.keys(eventWhere).length && {
            where: { event: event },
          }),
          required: false,
        },
        {
          model: this.models.EmailRegistry,
          as: 'email_registry',
        },
        {
          model: this.models.Campaign,
          as: 'campaign',
        }
      ],
      where: {
        campaign_id,
        aws_ses_message_id: {
          [Sequelize.Op.not]: null,
        },
        '$campaignClickEvents.id$': {
          [Sequelize.Op.is]: null,
        },
      },
    })
  }

  async countEmailEvent({
    campaign_id,
    event
  }: {
    campaign_id: number,
    event: string
  }): Promise<number> {
    let eventWhere: WhereOptions<any> = {};
    if (event) {
      eventWhere = {
        event: event
      }
    }

    return this.repository.count({
      include: [
        {
          model: this.models.CampaignClickEvent,
          as: 'campaignClickEvents',
          ...(Object.keys(eventWhere).length && {
            where: { event: event },
          }),
          required: true,
        }
      ],
      where: {
        campaign_id,
        aws_ses_message_id: {
          [Sequelize.Op.not]: null,
        },
      },
    })
  }

  async countGroupEmails({
    campaignId,
    emailRegistryGroupId,
  }: {
    campaignId: number;
    emailRegistryGroupId: number;
  }): Promise<number> {
    let where: WhereOptions<any> = {};

    if (campaignId) {
      where = { ...where, campaign_id: campaignId };
    }
    if (emailRegistryGroupId) {
      where = { ...where, email_registry_group_id: emailRegistryGroupId };
    }

    return this.repository.count({ where });
  }

}