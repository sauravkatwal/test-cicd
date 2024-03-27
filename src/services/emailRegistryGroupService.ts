import { defaultCursor } from '../config';
import * as Sequelize from 'sequelize';
import { fn, WhereOptions } from 'sequelize';
import slug from 'slug';
import { SortEnum, EmailRegistryGroupStatusEnum, EmailRegistryGroupTypesEnum } from '../enums';
import { SequlizeQueryGenerator } from '../helpers';
import {
  ArgsEmailRegistryInterface,
  EmailRegistryGroupInterface,
  InputEmailRegistryEmailRegistryGroupInterface,
  InputEmailRegistryGroupInterface,
  ModelsInterface,
} from '../interfaces';
import { EmailRegistryGroupRepository, EmailRegistryRepository, EmailRegistryEmailRegistryGroupRepository } from '../repositories';
export class EmailRegistryGroupService {
  private models: ModelsInterface;
  private repository: EmailRegistryGroupRepository;
  private emailRegistryRepository: EmailRegistryRepository;
  private emailRegistryEmailRegistryGroupRepository: EmailRegistryEmailRegistryGroupRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new EmailRegistryGroupRepository(this.models);
    this.emailRegistryRepository = new EmailRegistryRepository(this.models);
    this.emailRegistryEmailRegistryGroupRepository = new EmailRegistryEmailRegistryGroupRepository(this.models);
  }

  async create(input: InputEmailRegistryGroupInterface): Promise<EmailRegistryGroupInterface> {
    const emailRegistryGroupSulg = slug(input.label);
    const emailRegistryGroupSlugExists = await this.repository.findOne({
      where: { slug: emailRegistryGroupSulg, workspaceId: input.workspaceId, type:input.type },
    });
    if (emailRegistryGroupSlugExists ) throw new Error(`Email registry group: ${input.label} already exist!`);
    input.slug = emailRegistryGroupSulg;

    let emailRegistryGroupEmailRegistries: InputEmailRegistryEmailRegistryGroupInterface[] = [];
    let result;
    try {
      result = await this.models.EmailRegistryGroup.sequelize!.transaction( async (transaction) => {
        const emailRegistryGroup = await this.repository.create(input, undefined, {transaction} );
        if (input.emailRegistries) {
          const emailRegistries = await this.emailRegistryRepository.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: input.emailRegistries,
              },
              workspaceId: input.workspaceId
            },
          });
          emailRegistryGroupEmailRegistries = emailRegistries.map((item) => {
            return {
              emailRegistryId: item.id,
              emailRegistryGroupId: emailRegistryGroup.id
            };
          });
          await this.emailRegistryEmailRegistryGroupRepository.bulkCreate(emailRegistryGroupEmailRegistries, {transaction});
        }
      return emailRegistryGroup;
    })
    } catch (error) {
      console.error(error)
      throw new Error('Something went wrong!! Please try again')
    }
    return result;
  }

  findAll(where?: WhereOptions<any>): Promise<EmailRegistryGroupInterface[]> {
    return this.repository.findAll({ where });
  }

  async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
    workspaceId,
    status,
    type,
  }: ArgsEmailRegistryInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: EmailRegistryGroupInterface[];
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
    if (workspaceId) {
      where = { ...where, workspaceId: workspaceId };
    }
    if (status) {
      where = { ...where, status: status };
    }
    if (type) {
      where = { ...where, type:type };
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
      }),
    ]);
    return { rows, count, cursorCount };
  }

  findOne({
    label,
    slug,
    type,
  }: {
    label?: string;
    slug?: string;
    type?: EmailRegistryGroupTypesEnum;
  }): Promise<EmailRegistryGroupInterface> {
    let where: WhereOptions<any> = {};
    if (label) where = { ...where, label };
    if (slug) where = { ...where, slug };
    if (type) where = { ...where, type };
    return this.repository.findOne({ where });
  }

  async groupSummary({ emailRegistryGroupId }: { emailRegistryGroupId: number }) : Promise<Record<string, string>[]> {
    const statusSql = 
    `select
        er.status,
        count(*)
      from
        email_registry_groups erg
      inner join email_registry_email_registry_groups ererg on
        ererg.email_registry_group_id = erg.id
      inner join email_registries er on
        er.id = ererg.email_registry_id
      where
        erg.deleted_at is null
        and
          er.deleted_at is null
        and
          erg.id = ${emailRegistryGroupId}
      group by
        er.status;`,
    sanitizedStatusSql = 
    `SELECT 
    CASE 
      WHEN er.sanitized_status = 'deliverable' THEN 'deliverable'
      ELSE 'undeliverable'
        END AS "sanitizedStatus",
        COUNT(*) AS count
    FROM 
        email_registry_groups erg
    INNER JOIN 
        email_registry_email_registry_groups ererg ON ererg.email_registry_group_id = erg.id
    INNER JOIN 
        email_registries er ON er.id = ererg.email_registry_id
    WHERE 
        erg.deleted_at IS NULL AND
        er.deleted_at IS NULL AND
        erg.id = ${emailRegistryGroupId}
    GROUP BY 
        CASE 
            WHEN er.sanitized_status = 'deliverable' THEN 'deliverable'
            ELSE 'undeliverable'
        END;`;

    const [status, sanitizedStatus] = await Promise.all([
      this.models.EmailRegistryGroup.sequelize?.query(statusSql),
      this.models.EmailRegistryGroup.sequelize?.query(sanitizedStatusSql),
    ]);

    const [statusData] = status as any;
    const [sanitizedStatusData] = sanitizedStatus as any;
    return [...statusData, ...sanitizedStatusData];
  }

  async findByPk(id: number): Promise<EmailRegistryGroupInterface> {
    const emailRegistryGroupExists = await this.repository.findByPk(id, {
      include: [
        {
          model: this.models.EmailRegistry,
          as: 'emailRegistries',
          attributes: ['id'],
        },
      ],
    });
    if (!emailRegistryGroupExists) throw new Error(`Email registry group: ${id} does not exist!`);
    return emailRegistryGroupExists;
  }

  async updateOne(id: number, input: InputEmailRegistryGroupInterface): Promise<EmailRegistryGroupInterface> {
    const emailRegistryGroupSulg = slug(input.label);
    const emailRegistryGroupExists = await this.repository.findByPk(id);
    if (!emailRegistryGroupExists) throw new Error(`Email registry group: ${id} does not exist!`);

    if (input.label) {
      const emailRegistryGroupSlugExists = await this.repository.findOne({
        where: {
          slug: emailRegistryGroupSulg,
          workspaceId: input.workspaceId,
          type: input.type
        },
      });
      if (emailRegistryGroupSlugExists && emailRegistryGroupSlugExists.id !== id)
        throw new Error(`Email registry group: ${input.label} already exist!`);
      input.slug = emailRegistryGroupSulg;
    }
    const [update] = await this.repository.updateOne({ id, input });
    if (update === 0) throw new Error(`Email registry group: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }

  async deleteOne(id: number): Promise<boolean> {
    const emailRegistryGroupExists = await this.repository.findByPk(id);
    if (!emailRegistryGroupExists) throw new Error(`Email registry group: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Email registry group: ${id} does not exist!`);
    return true;
  }

  async getEmailRegistry({ids, attribute}: {ids: number[], attribute:string}) : Promise<any> {
    return this.emailRegistryRepository.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: ids,
        },
      },
      attributes: [`${attribute}`, [fn('COUNT', `${attribute}`), 'count']],
      group: [`${attribute}`],
    });
  }
  async count({
    workspaceId,
    emailRegistryGroupStatus,
    EmailRegistryGroupType,
    fromDate,
    toDate,
  }: {
    workspaceId: number;
    emailRegistryGroupStatus?: EmailRegistryGroupStatusEnum;
    EmailRegistryGroupType?: EmailRegistryGroupTypesEnum
    fromDate?: Date;
    toDate?: Date;
  }): Promise<number> {
    let where: WhereOptions<any> = {};
    if (workspaceId) {
      where = { ...where, workspace_id: workspaceId };
    }
    if (emailRegistryGroupStatus) {
      where = { ...where, status: emailRegistryGroupStatus };
    }
    if (EmailRegistryGroupType) {
      where = { ...where, type: EmailRegistryGroupType };
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
