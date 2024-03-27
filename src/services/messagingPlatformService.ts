import { defaultCursor } from '../config';
import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { SortEnum } from '../enums';
import { SequlizeQueryGenerator } from '../helpers';
import { ArgsMessagingPlatformInterface, MessagingPlatformInterface, ModelsInterface } from '../interfaces';
import { MessagingPlatformRepository } from '../repositories';
import slug from 'slug';
export class MessagingPlatformService {
  private models: ModelsInterface;
  private repository: MessagingPlatformRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new MessagingPlatformRepository(this.models);
  }

  async findByPk(id: number): Promise<MessagingPlatformInterface> { 
    return this.repository.findByPk(id);
  }
  async findOne(name:string): Promise<MessagingPlatformInterface>  {
    let where : WhereOptions <any> = {}
      if(name){
        let slugExist = slug(name)
        where = {...where, slug:slugExist }
      }
      const messagingPlatformExist = this.repository.findOne({where:where})
       if(!messagingPlatformExist) throw new Error(`MessagingPlatform ${name} does not exist`);
       return messagingPlatformExist;
}
  async findAndCountAll({     
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query 
  }: ArgsMessagingPlatformInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: MessagingPlatformInterface[];
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
        [Sequelize.Op.or]: [
          SequlizeQueryGenerator.searchRegex({
            query,
            columns: ['name', 'slug'],
          }),
        ],
      };
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
      this.repository.findAll({ where: { ...cursorWhere, ...where }, limit, order: orderItem }),
    ]);

    return { rows, count, cursorCount };
  }
}
