import { defaultCursor } from '../config';
import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { EmailRegistrySanitizedStatusEnum, SortEnum, EmailRegistryStatusEnum } from '../enums';
import { SequlizeQueryGenerator } from '../helpers';
import { ArgsTestEmailRegistryInterface, TestEmailRegistryInterface, InputTestEmailRegistryInterface, ModelsInterface } from '../interfaces';
import { EmailRegistryEmailRegistryGroupRepository, TestEmailRegistryRepository } from '../repositories';

export class TestEmailRegistryService {
  private models: ModelsInterface;
  private repository: TestEmailRegistryRepository;
  private emailRegistryEmailRegistryGroupRepository: EmailRegistryEmailRegistryGroupRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new TestEmailRegistryRepository(this.models);
    this.emailRegistryEmailRegistryGroupRepository = new EmailRegistryEmailRegistryGroupRepository(this.models);
  }

  async create(input: InputTestEmailRegistryInterface): Promise<TestEmailRegistryInterface> {
    if (input.email) {
      const testUserEmailExists = await this.repository.findOne({
        where: {
          email: input.email,
          workspaceId: input.workspaceId,
        },
      });
      if (testUserEmailExists) throw new Error(`Test Email Registry: ${input.email} already exist in the list!`);
    }

    if (input.phoneNumber) {
      const testUserEmailExists = await this.repository.findOne({
        where: {
          phoneNumber: input.phoneNumber,
          workspaceId: input.workspaceId,
        },
      });
      if (testUserEmailExists) throw new Error(`Test Email Registry: ${input.phoneNumber} already exist in the list!`);
    }
    if (input.emailRegistryGroupId) {
      input.emailRegistryEmailRegistryGroups = [{ emailRegistryGroupId: input.emailRegistryGroupId }];
    }
    if (input.emailRegistryGroupIds) {
      input.emailRegistryEmailRegistryGroups = input.emailRegistryGroupIds.map((item) => ({
        emailRegistryGroupId: item,
      }));
    }

    return this.repository.create(input);
  }



  findAll({
    ids,
    emails,
    workspaceId,
  }: {
    ids?: number[];
    emails?: string[];
    workspaceId?: number;
  }): Promise<TestEmailRegistryInterface[]> {
    let where: WhereOptions<any> = {};
    if (ids) {
      where = { ...where, id: { [Sequelize.Op.in]: ids } };
    }
    if (emails) {
      where = { ...where, email: { [Sequelize.Op.in]: emails } };
    }
    if (workspaceId) {
      where = { ...where, workspaceId: workspaceId };
    }
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
    sanitizedStatus,
    emailRegistryGroupId,
  }: ArgsTestEmailRegistryInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: TestEmailRegistryInterface[];
  }> {
    let emailRegistryEmailRegistryGroupsWhere: WhereOptions<any> = {};
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
            columns: ['name', 'email'],
          }),
      };
    }
    if (workspaceId) {
      where = { ...where, workspaceId: workspaceId };
    }
    if (status) {
      where = { ...where, status: status };
    }
    if (sanitizedStatus && sanitizedStatus === EmailRegistrySanitizedStatusEnum.deliverable) {
      where = { ...where, sanitizedStatus: EmailRegistrySanitizedStatusEnum.deliverable };
    }
    if (sanitizedStatus && sanitizedStatus !== EmailRegistrySanitizedStatusEnum.deliverable) {
      where = { ...where, [Sequelize.Op.and]: [{ sanitizedStatus: { [Sequelize.Op.not]: EmailRegistrySanitizedStatusEnum.deliverable } }, { sanitizedStatus: { [Sequelize.Op.ne]: null } }] };
    }
    if (emailRegistryGroupId) {
      emailRegistryEmailRegistryGroupsWhere = {
        ...emailRegistryEmailRegistryGroupsWhere,
        emailRegistryGroupId: emailRegistryGroupId,
      };
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
            model: this.models.EmailRegistryEmailRegistryGroup,
            as: 'emailRegistryEmailRegistryGroups',
            attributes: ['id', 'emailRegistryGroupId'],
            ...(Object.keys(emailRegistryEmailRegistryGroupsWhere).length && {
              where: emailRegistryEmailRegistryGroupsWhere,
            }),
          },
        ],
      }),
    ]);

    return { cursorCount, count, rows };
  }

  async findByPk(id: number): Promise<TestEmailRegistryInterface> {
    const emailRegistryExists = await this.repository.findByPk(id);
    if (!emailRegistryExists) throw new Error(`Test Email Registry: ${id} does not exist!`);
    return emailRegistryExists;
  }

  async updateOne(id: number, input: Partial<InputTestEmailRegistryInterface>): Promise<TestEmailRegistryInterface> {
    const emailRegistryExists = await this.repository.findByPk(id);
    if (!emailRegistryExists) throw new Error(`Test Email Registry: ${id} does not exist!`);

    if (input.email) {
      const testUserEmailExists = await this.repository.findOne({
        where: {
          email: input.email,
          workspaceId: input.workspaceId,
        },
      });
      if (testUserEmailExists && testUserEmailExists.id !== id)
        throw new Error(`Test Email Registry: ${input.email} already exist in group!`);
    }

    const [update] = await this.repository.updateOne({ id, input });
    if (update === 0) throw new Error(`Test Email Registry: ${id} does not exist!`);
    return this.findByPk(id);
  }

  async update({ email }: { email?: string }, input: Partial<InputTestEmailRegistryInterface>): Promise<[number]> {
    let where: WhereOptions<any> = {};
    if (email) {
      where = { ...where, email: email };
    }
    return this.repository.update({
      where,
      input,
    });
  }

  async deleteOne(id: number): Promise<boolean> {
    const emailRegistryExists = await this.repository.findByPk(id);
    if (!emailRegistryExists) throw new Error(`Test Email Registry: ${id} does not exist!`);
    await this.emailRegistryEmailRegistryGroupRepository.deleteMany({ where: { emailRegistryId: id } });
    await this.repository.deleteOne(id);
    return true;
  }

  async count({
    status,
    sanitizedStatus,
    workspaceId,
    fromDate,
    toDate,
  }: {
    status?: EmailRegistryStatusEnum;
    sanitizedStatus?: EmailRegistrySanitizedStatusEnum;
    workspaceId: number;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<number> {
    let where: WhereOptions<any> = {};
    if (workspaceId) {
      where = { ...where, workspace_id: workspaceId };
    }
    if (status) {
      where = { ...where, status: status };
    }
    if (sanitizedStatus) {
      if (sanitizedStatus === EmailRegistrySanitizedStatusEnum.deliverable) {
        where.sanitizedStatus = sanitizedStatus;
      } else {
        where.sanitizedStatus = { [Sequelize.Op.ne]: EmailRegistrySanitizedStatusEnum.deliverable };
      }
    }
    if(fromDate && toDate) {
      where = { ...where, createdAt: { [Sequelize.Op.between]: [fromDate, toDate] } };
    }

    return this.repository.count({ where });
  }
  async findOne({
    email,
    workspaceId,
  }: {
    email?: string;

    workspaceId?: number | undefined;
  }): Promise<TestEmailRegistryInterface> {
    let where: WhereOptions<any> = {};

   
    if (email) {
      where = { ...where, email: email };
    }
    if (workspaceId) {
      where = { ...where, workspaceId: workspaceId };
    }
    const result = await this.repository.findOne({where});
    if (!result) throw new Error(`${email} does not exist!`);
    return result 
  }

}
