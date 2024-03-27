import { defaultCursor } from '../config';
import * as Sequelize from 'sequelize';
import { WhereOptions, cast, col, fn, where } from 'sequelize';
import { EmailRegistrySanitizedStatusEnum, SortEnum, EmailRegistryStatusEnum } from '../enums';
import { encryption } from '../config';
import { SequlizeQueryGenerator } from '../helpers';
import {
  ArgsEmailRegistryInterface,
  EmailRegistryInterface,
  InputImportEmailRegistryInterface,
  InputEmailRegistryInterface,
  ModelsInterface,
} from '../interfaces';
import {
  CountryDivisionRepository,
  AttributeValueRepository,
  EmailRegistryEmailRegistryGroupRepository,
  EmailRegistryRepository,
} from '../repositories';
import { genders, nationalities, districts, provinces } from '../constants';
import slug from 'slug';

export class EmailRegistryService {
  private models: ModelsInterface;
  private repository: EmailRegistryRepository;
  private emailRegistryEmailRegistryGroupRepository: EmailRegistryEmailRegistryGroupRepository;
  private countryDivisionRepository: CountryDivisionRepository;
  private attributeValueRepository: AttributeValueRepository;
  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new EmailRegistryRepository(this.models);
    this.emailRegistryEmailRegistryGroupRepository = new EmailRegistryEmailRegistryGroupRepository(this.models);
    this.countryDivisionRepository = new CountryDivisionRepository();
    this.attributeValueRepository = new AttributeValueRepository();
  }

  async create(input: InputEmailRegistryInterface): Promise<EmailRegistryInterface> {
    if (input.email) {
      const emailRegistryEmailExists = await this.repository.findOne({
        where: {
          email: input.email,
          workspaceId: input.workspaceId,
        },
      });
      if (emailRegistryEmailExists) throw new Error(`Email registry: ${input.email} already exist in the list!`);
    }

    if (input.emailRegistryGroupId) {
      input.emailRegistryEmailRegistryGroups = [{ emailRegistryGroupId: input.emailRegistryGroupId }];
    }
    if (input.emailRegistryGroupIds) {
      input.emailRegistryEmailRegistryGroups = input.emailRegistryGroupIds.map((item) => ({
        emailRegistryGroupId: item,
      }));
    }

    return this.repository.create(input, {
      include: [{ model: this.models.EmailRegistryEmailRegistryGroup, as: 'emailRegistryEmailRegistryGroups' }],
    });
  }

  async createV2(input: InputEmailRegistryInterface): Promise<EmailRegistryInterface> {
    if (input.emailRegistryGroupId) {
      input.emailRegistryEmailRegistryGroups = [{ emailRegistryGroupId: input.emailRegistryGroupId }];
    }
    if (input.emailRegistryGroupIds) {
      input.emailRegistryEmailRegistryGroups = input.emailRegistryGroupIds.map((item) => ({
        emailRegistryGroupId: item,
      }));
    }

    return this.repository.create(input, {
      include: [{ model: this.models.EmailRegistryEmailRegistryGroup, as: 'emailRegistryEmailRegistryGroups' }],
    });
  }

  async bulkCreate(input: InputImportEmailRegistryInterface[]): Promise<EmailRegistryInterface[]> {
    const emailRegistryObjects: InputEmailRegistryInterface[] = [];
    const createdEmailRegistryObjects: EmailRegistryInterface[] = [];
    const existingEmails = await this.repository.findAll({
      where: {
        email: input.map((item) => item.email),
        workspaceId: input.map((item) => item.workspaceId),
      },
    });

    const existingEmailSet = new Set(existingEmails.map((obj) => obj.email));

    const genders = await this.attributeValueRepository.findAll({
      where: { attribute_id: 1 },
    });
    const genderMap = new Map(genders.map((gender) => [gender.value, gender.id]));
    const nationalities = await this.attributeValueRepository.findAll({
      where: { attribute_id: 2 },
    });
    const nationalityMap = new Map(nationalities.map((nationality) => [nationality.value, nationality.id]));
    const provinces = await this.countryDivisionRepository.findAll({
      where: { type: 'state' },
    });
    const provinceMap = new Map(provinces.map((province) => [province.name, province.id]));
    const districts = await this.countryDivisionRepository.findAll({
      where: { type: 'district' },
    });
    const districtMap = new Map(districts.map((district) => [district.name, district.id]));

    input.map((emailRegistry) => {
      if (emailRegistry.email && existingEmailSet.has(emailRegistry.email)) {
        createdEmailRegistryObjects.push(existingEmails.find((obj) => obj.email === emailRegistry.email)!);
        return;
      }

      if (emailRegistry.emailRegistryGroupId) {
        emailRegistry.emailRegistryEmailRegistryGroups = [{ emailRegistryGroupId: emailRegistry.emailRegistryGroupId }];
      }

      if (emailRegistry.emailRegistryGroupIds) {
        emailRegistry.emailRegistryEmailRegistryGroups = emailRegistry.emailRegistryGroupIds.map((item) => ({
          emailRegistryGroupId: item,
        }));
      }

      if (emailRegistry.gender && genderMap.has(emailRegistry.gender)) {
        emailRegistry.genderId = genderMap.get(emailRegistry.gender);
      }
      if (emailRegistry.nationality && nationalityMap.has(emailRegistry.nationality)) {
        emailRegistry.nationalityId = nationalityMap.get(emailRegistry.nationality);
      }
      if (emailRegistry.province && provinceMap.has(emailRegistry.province)) {
        emailRegistry.provinceId = provinceMap.get(emailRegistry.province);
      }
      if (emailRegistry.district && districtMap.has(emailRegistry.district)) {
        emailRegistry.districtId = districtMap.get(emailRegistry.district);
      }

      emailRegistryObjects.push(emailRegistry);
    });
    const bulkData = await this.repository.bulkCreate(emailRegistryObjects);
    return createdEmailRegistryObjects.concat(bulkData);
  }

  async findOne({ email, workspaceId }: { email: string; workspaceId: number }): Promise<EmailRegistryInterface> {
    let where: WhereOptions<any> = {};
    if (workspaceId) {
      where = { ...where, workspace_id: workspaceId };
    }
    if (email) {
      where = {
        ...where,
        email: email,
      };
    }

    return this.repository.findOne({ where });
  }

  async findAll({
    ids,
    emails,
    workspaceId,
    status,
  }: {
    ids?: number[];
    emails?: string[];
    workspaceId?: number;
    status?: EmailRegistryStatusEnum;
  }): Promise<EmailRegistryInterface[]> {
    let where: WhereOptions<any> = {};

    if (workspaceId) {
      where = { ...where, workspace_id: workspaceId };
    }

    if (ids) {
      where = { ...where, id: { [Sequelize.Op.in]: ids } };
    }
    if (emails) {
      where = { ...where, email: { [Sequelize.Op.in]: emails } };
    }
    if (status) {
      where = { ...where, status: status };
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
  }: ArgsEmailRegistryInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: EmailRegistryInterface[];
  }> {
    let emailRegistryEmailRegistryGroupsWhere: WhereOptions<any> = {};
    let where: WhereOptions<any> = {},
      cursorWhere: WhereOptions<any> = {},
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
          columns: ['name'],
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
      where = {
        ...where,
        [Sequelize.Op.and]: [
          { sanitizedStatus: { [Sequelize.Op.not]: EmailRegistrySanitizedStatusEnum.deliverable } },
          { sanitizedStatus: { [Sequelize.Op.ne]: null } },
        ],
      };
    }
    if (emailRegistryGroupId) {
      emailRegistryEmailRegistryGroupsWhere = {
        ...emailRegistryEmailRegistryGroupsWhere,
        emailRegistryGroupId: emailRegistryGroupId,
      };
      includeOptions.push({
        model: this.models.EmailRegistryEmailRegistryGroup,
        as: 'emailRegistryEmailRegistryGroups',
        attributes: ['id', 'emailRegistryGroupId'],
        ...(Object.keys(emailRegistryEmailRegistryGroupsWhere).length && {
          where: emailRegistryEmailRegistryGroupsWhere,
        }),
      });
    }
    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }

    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }
    const [count, cursorCount, rows] = await Promise.all([
      this.repository.count({
        where: { ...where },
        distinct: true,
        include: includeOptions,
      }),
      this.repository.count({
        where: { ...cursorWhere, ...where },
        distinct: true,
        include: includeOptions,
      }),
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

  async findByPk(id: number): Promise<EmailRegistryInterface> {
    const emailRegistryExists = await this.repository.findByPk(id);
    if (!emailRegistryExists) throw new Error(`Email registry: ${id} does not exist!`);
    return emailRegistryExists;
  }

  async updateOne(id: number, input: Partial<InputEmailRegistryInterface>): Promise<EmailRegistryInterface> {
    const emailRegistryExists = await this.repository.findByPk(id);
    if (!emailRegistryExists) throw new Error(`Email registry: ${id} does not exist!`);

    if (input.email) {
      const emailRegistryEmailExists = await this.repository.findOne({
        where: {
          email: input.email,
          workspaceId: input.workspaceId,
        },
      });
      if (emailRegistryEmailExists && emailRegistryEmailExists.id !== id)
        throw new Error(`Email registry: ${input.email} already exist in group!`);
    }

    const [update] = await this.repository.updateOne({ id, input });
    if (update === 0) throw new Error(`Email registry: ${id} does not exist!`);
    return this.findByPk(id);
  }

  async update({ email }: { email: string }, input: Partial<InputEmailRegistryInterface>): Promise<[number]> {
    let whereOptions: WhereOptions<any> = {};
    if (email) {
      whereOptions = {
        ...whereOptions,
        email: where(fn('pgp_sym_decrypt', cast(col('email'), 'bytea'), encryption.symmetricKey), '=', email),
      };
    }
    return this.repository.update({
      where: whereOptions,
      input,
    });
  }
  
  async updateBulkDate({ emails }: { emails: string[] }): Promise<[number]> {
    return this.repository.update({
      where: {
        email: where(fn('pgp_sym_decrypt', cast(col('email'), 'bytea'), encryption.symmetricKey), {
          [Sequelize.Op.in]: emails,
        }),
      },
      input: { sanitizedDate: new Date() },
    });
  }

  async updateBulk({ emails }: { emails: string[] }): Promise<[number]> {
    return this.repository.update({
      where: {
        email: where(fn('pgp_sym_decrypt', cast(col('email'), 'bytea'), encryption.symmetricKey), {
          [Sequelize.Op.in]: emails,
        }),
      },
      input: { status: EmailRegistryStatusEnum.inprogress },
    });
  }

  async deleteOne(id: number): Promise<boolean> {
    const emailRegistryExists = await this.repository.findByPk(id);
    if (!emailRegistryExists) throw new Error(`Email registry: ${id} does not exist!`);
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
    if (fromDate && toDate) {
      where = {
        ...where,
        createdAt: {
          [Sequelize.Op.between]: [fromDate, new Date(toDate + 'T23:59:59.999Z')],
        },
      };
    }

    return this.repository.count({ where });
  }
}
