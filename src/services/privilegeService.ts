import * as Sequelize from 'sequelize';
import { GraphQLError } from 'graphql';
import { WhereOptions } from 'sequelize';
import slug from 'slug';
import { SequlizeQueryGenerator } from '../helpers';
import { ArgsPrivilegesInterface, InputPrivilegeInterface, PrivilegeInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { PrivilegeRepository, ModuleRepository } from '../repositories';
import { SortEnum } from '../enums';
import { defaultCursor } from '../config';

export class PrivilegeService {
  private repository: PrivilegeRepository;
  private moduleRepository: ModuleRepository;

  constructor() {
    this.repository = new PrivilegeRepository();
    this.moduleRepository = new ModuleRepository();
  }

  async create(input: InputPrivilegeInterface): Promise<PrivilegeInterface> {
    const privilegeSlug = slug(input.name);
    const privilegeSlugExists = await this.repository.findOne({
      where: { slug: privilegeSlug},
    });

    const moduleExists = await this.moduleRepository.findByPk(input.moduleId);

    if(!moduleExists) {
      throw new GraphQLError(`Module: Module id ${input.moduleId} does not exist`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'moduleId',
        },
      });
    }

    if (privilegeSlugExists) throw new Error(`Privilege: ${input.name} already exist!`);
    input.slug = privilegeSlug;

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
   }: ArgsPrivilegesInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: PrivilegeInterface[];
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
          columns: ['name', 'slug'],
        }),
      };
    }
    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }
    
    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }
    const [cursorCount, count, rows] = await Promise.all([
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.count({ where: { ...where } }),
      this.repository.findAll({
        where,
        limit,
        order: orderItem,
        include: [
          {
            model: Model.Module,
            as: 'module',
            attributes: ['id', 'name', 'slug', 'is_default'],
            include: [
              {
                model: Model.Screen,
                as: 'screen',
                attributes: ['id', 'name', 'slug', 'is_default'],
              },
            ],
          },
        ],
      })
    ])
    return { cursorCount, count, rows }
  }

  async findByPk(id: number): Promise<PrivilegeInterface> {
    const privilegeExists = await this.repository.findByPk(id);
    if (!privilegeExists) throw new Error(`Privilege: ${id} does not exist!`);
    return privilegeExists;
  }

  async updateOne(id: number, input: InputPrivilegeInterface): Promise<PrivilegeInterface> {
    const privilegeExists = await this.repository.findByPk(id);
    if (!privilegeExists) throw new Error(`Privilege: ${id} does not exist!`);
    if (privilegeExists.isDefault) throw new Error(`Cannot update privilege when default is set to true!.`);
    if (input.name) {
    const privilegeSlug = slug(input.name);
    const privilegeSlugExists = await this.repository.findOne({
      where: { slug: privilegeSlug },
    });

    if (privilegeSlugExists && privilegeSlugExists.id != id ) 
    throw new Error(`Privilege: ${input.name} already exist!`);
    input.slug = privilegeSlug;
    }
    const update = await this.repository.updateOne({ id, input });
    if (update[0] === 0) throw new Error(`Privilege: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }

  findOne({
    slug,
  }: {
    slug?: string;
  }): Promise<PrivilegeInterface> {
    let where: WhereOptions<any> = {};

    if (slug) {
      where = { ...where, slug: slug }
    }
    return this.repository.findOne({ where });
  }
  async deleteOne(id: number): Promise<boolean> {
    const privilegeExists = await this.repository.findByPk(id);
    if (!privilegeExists) throw new Error(`privilege: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`privilege: ${id} does not exist!`);
    return true;
  }
}
