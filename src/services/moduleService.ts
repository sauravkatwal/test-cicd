import { SequlizeQueryGenerator } from '../helpers';
import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import slug from 'slug';
import { ModuleInterface, InputModuleInterface, ArgsModulesInterface } from '../interfaces';
import { ModuleRepository } from '../repositories';
import Model from '../core/models/index-new';
import { SortEnum } from '../enums';
import { defaultCursor } from '../config';


export class ModuleService {
  private repository: ModuleRepository;

  constructor() {
    this.repository = new ModuleRepository();
  }

  async create(input: InputModuleInterface): Promise<ModuleInterface> {
    const moduleSlug = slug(input.name);
    const moduleSlugExists = await this.repository.findOne({
      where: { slug: moduleSlug},
    });
    if (moduleSlugExists) throw new Error(`Name: ${input.name} already exist!`);
    input.slug = moduleSlug;

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
  }: ArgsModulesInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: ModuleInterface[];
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
            model: Model.Screen,
            as: 'screen',
            attributes: ['id', 'name', 'slug'],
          },
        ],
      })
    ])
    return { cursorCount, count, rows }
  }

  async findByPk(id: number): Promise<ModuleInterface> {
    const userExists = await this.repository.findByPk(id, {
      include: [
        {
          model: Model.Screen,
          as: 'screen',
          attributes: ['name', 'slug'],
        },
      ],
    });
    if (!userExists) throw new Error(`Module: ${id} does not exist!`);
    return userExists;
  }

  async updateOne(id: Sequelize.CreationOptional<number>, input: Partial<InputModuleInterface>): Promise<ModuleInterface> {
    const moduleExists = await this.repository.findByPk(id);
    if (!moduleExists) throw new Error(`Module: ${id} does not exist!`);

    if (moduleExists.isDefault) throw new Error(`Cannot update module when set to default to true!.`);

    if (input.name) {
      const moduleSlug = slug(input.name);
      const moduleSlugExists = await this.repository.findOne({
        where: { slug: moduleSlug },
      });
      if (moduleSlugExists && moduleSlugExists.id.toString() !== id.toString())
        throw new Error(`Module: ${input.name} already exist!`);
      input.slug = moduleSlug;
    }

    const update = await this.repository.updateOne({ id, input });
    if (update[0] === 0) throw new Error(`Module: ${id} does not exist!`);
    return this.findByPk(id);
  }

  async deleteOne(id: number): Promise<boolean> {
    const moduleExists = await this.repository.findByPk(id);
    if (!moduleExists) throw new Error(`Module: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Module: ${id} does not exist!`);
    return true;
  }
}
