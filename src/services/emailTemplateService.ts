import * as Sequelize from 'sequelize';
import slug from 'slug';
import { SortEnum,EmailTemplateApprovedStatus } from '../enums';
import { WhereOptions } from 'sequelize';
import { SequlizeQueryGenerator, Ksuid } from '../helpers';
import { ArgsEmailTemplateInterface, EmailTemplateInterface, InputEmailTemplateInterface, ModelsInterface } from '../interfaces';
import { EmailTemplateRepository, UserRepository } from '../repositories';
import { defaultCursor } from '../config';

export class EmailTemplateService {
  private models: ModelsInterface;
  private repository: EmailTemplateRepository;
  private userRepository: UserRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new EmailTemplateRepository(this.models);
    this.userRepository = new UserRepository();
  }

  async create(input: InputEmailTemplateInterface): Promise<EmailTemplateInterface> {
    const emailTemplateSlug = slug(input.name);
    const emailTemplateSlugExists = await this.repository.findOne({
      where: { slug: emailTemplateSlug, workspace_id: input.workspace_id, messagingPlatform:input.messagingPlatform },
    });
    if (emailTemplateSlugExists) throw new Error(`Email template: ${input.name} already exist!`);
    input.slug = emailTemplateSlug;
    input.templateCode = Ksuid.randomSync();
    return this.repository.create(input);
  }

  async findAndCountAll({     
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
    workspace_id, 
    messagingPlatform 
  }: ArgsEmailTemplateInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: EmailTemplateInterface[];
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
        [Sequelize.Op.or]: SequlizeQueryGenerator.searchRegex({
          query,
          columns: ['name', 'description'],
        }),
      };
    }
    if (workspace_id) {
      where = { ...where, workspace_id: workspace_id };
    }
    if(messagingPlatform) {
      where = { ...where, messagingPlatform: messagingPlatform };
    }
    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }
    
    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }
    const [count, cursorCount, rows] = await Promise.all([
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.count({ where: { ...where } }),
      this.repository.findAll({
        where: { ...cursorWhere, ...where },
        limit,
        order: orderItem,
        include: [
          {
            model: this.models.CampaignSchedule,
            as: 'campaignSchedule',
            attributes: ['id']
          }
        ]
      }),
    ]);
    const response = rows.map(async (row) => {
      const user = await this.userRepository.findByPk(row.created_by_id!);
      row.created_by = user;
    })
    await Promise.all(response);
 
    return { rows, count, cursorCount };
  }

  async findOne({
    templateCode,
    slug,
    workspaceId
  }: {
    templateCode?: string;
    slug?: string;
    workspaceId?: number;
  }): Promise<EmailTemplateInterface> {
    let where: WhereOptions<any> = {};

    if (workspaceId) {
      where = { ...where, workspace_id: workspaceId };
    }
    if (templateCode) {
      where = { ...where, templateCode: templateCode };
    }
    if (slug) {
      where = { ...where, slug: slug };
    }

    return this.repository.findOne({ where });
  }

  async findByPk(id: number): Promise<EmailTemplateInterface> {
    const emailTemplateExists = await this.repository.findByPk(id);
    if (!emailTemplateExists) throw new Error(`Email template: ${id} does not exist!`);
    return emailTemplateExists;
  }

  async updateOne(id: number, input: InputEmailTemplateInterface): Promise<EmailTemplateInterface> {
    const emailTemplateSlug = slug(input.name.toString());
    const emailTemplateExists = await this.repository.findByPk(id);
    if (!emailTemplateExists) throw new Error(`Email Template: ${id} does not exist!`);
    if (input.workspace_id) {
      const emailTemplateSlugExists = await this.repository.findOne({
        where: { slug: emailTemplateSlug, workspace_id: input.workspace_id },
      });

      if (emailTemplateSlugExists && emailTemplateSlugExists.id !== id)
        throw new Error(`Email Template: ${input.name} already exist!`);
      input.slug = emailTemplateSlug;
    }
    const [update] = await this.repository.updateOne({ id, input });
    if (update === 0) throw new Error(`Email registry: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }

  async update({ id, input }: { id: number, input: Partial<EmailTemplateInterface>}){
    const emailTemplateExists = await this.repository.findByPk(id);
    if (!emailTemplateExists) throw new Error(`Email Template: ${id} does not exist!`);
    if(emailTemplateExists.approvedStatus === EmailTemplateApprovedStatus.approved) throw new Error(`Template already approved!`);
    const [update] = await this.repository.updateOne({ id, input });
    if (update === 0) throw new Error(`Email template id: ${id} does not exist!`);
    return this.findByPk(id);
  }

  async deleteOne(id: number): Promise<boolean> {
    const emailTemplateExists = await this.repository.findByPk(id);
    if (!emailTemplateExists) throw new Error(`Email template: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Email template: ${id} does not exist!`);
    return true;
  }
  
  async count({
    workspaceId,
    approvedStatus,
    fromDate,
    toDate,
  }: {
    workspaceId: number;
    approvedStatus?: EmailTemplateApprovedStatus;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<number> {
    let where: WhereOptions<any> = {};
    if (workspaceId) {
      where = { ...where, workspace_id: workspaceId };
    }
    if (approvedStatus) {
      where = { ...where, approvedStatus: approvedStatus };
    }
    if (fromDate && toDate) {
      where = { ...where,  createdAt: {
        [Sequelize.Op.between]: [fromDate, new Date(toDate + 'T23:59:59.999Z')],
      }    
     };
    };

    return this.repository.count({ where });
  }
}