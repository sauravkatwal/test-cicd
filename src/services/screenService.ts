import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import slug from 'slug';
import { SequlizeQueryGenerator } from '../helpers';
import { ArgsScreensInterface, InputScreenInterface, ScreenInterface } from '../interfaces';
import { ScreenRepository } from '../repositories';
import { SortEnum } from '../enums';
import Model from '../core/models/index-new';
import { defaultCursor } from '../config';

export class ScreenService {
  private repository: ScreenRepository;

  constructor() {
    this.repository = new ScreenRepository();
  }

  async create(input: InputScreenInterface): Promise<ScreenInterface> {
    const screenSlug = slug(input.name);
    const screenSlugExists = await this.repository.findOne({
      where: { slug: screenSlug},
    });
    if (screenSlugExists) throw new Error(`Name: ${input.name} already exist!`);
    input.slug = screenSlug;

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
   }: ArgsScreensInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: ScreenInterface[];
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
            as: 'modules',
            attributes: ['id', 'name', 'slug'],
            include: [
              {
                model: Model.Privilege,
                as: 'privileges',
                attributes: ['id', 'name', 'slug', 'is_default'],
              },
            ],
          },
        ],
      }),
    ]);
    return { cursorCount, count, rows };
  }

  async findByPk(id: number): Promise<ScreenInterface> {
    const screens = await this.repository.findByPk(id, {
      include: [
        {
          model: Model.Module,
          as: 'modules',
          attributes: ['id','name', 'slug'],
          include: [
            {
              model: Model.Privilege,
              as: 'privileges',
              attributes: ['id','name', 'slug', 'is_default'],
            },
          ],
        },
      ],
    });

    if (!screens) throw new Error(`Screen: ${id} does not exist!`);
    return screens;
  }

  async updateOne(id: number, input: InputScreenInterface): Promise<ScreenInterface> {
    const screenSlug = slug(input.name);
    const screenExists = await this.repository.findByPk(id);
    if (!screenExists) throw new Error(`Screen: ${id} does not exist!`);
    if (input.name) {
      const screenSlugExists = await this.repository.findOne({
        where: { slug: screenSlug },
      });

      if (screenSlugExists && screenSlugExists.id !== id)
        throw new Error(`Screen : ${input.name} already exist!`);
      input.slug = screenSlug;
    }
  
    const update = await this.repository.updateOne({ id, input });
    if (update[0] === 0) throw new Error(`Screen: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }
  async deleteOne(id: number): Promise<boolean> {
    const screenExists = await this.repository.findByPk(id);
    if (!screenExists) throw new Error(`Screen: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Screen: ${id} does not exist!`);
    return true;
  }
}
