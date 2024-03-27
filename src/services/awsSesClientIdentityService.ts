import { AwsSesStatus, SortEnum } from '../enums';
import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';

import { SequlizeQueryGenerator } from '../helpers';
import {
  ArgsAWSSesClientIdentitiyInterface,
  AWSSesClientIdentitiyInterface,
  InputAWSSesClientIdentityInterface,
  ModelsInterface
} from '../interfaces';
import { AWSSesClientIdentityRepository } from '../repositories/awsSesClientIdentityRepository';
import { AwsSES } from '../utils';
import { defaultCursor } from '../config';

export class AWSSesClientIdentityService {
  private models: ModelsInterface;
  private repository: AWSSesClientIdentityRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new AWSSesClientIdentityRepository(this.models);
  }

  async create(input: InputAWSSesClientIdentityInterface): Promise<AWSSesClientIdentitiyInterface> {
    const clientIdentityExists = await this.repository.findOne({
      where: { identity: input.identity, workspaceId: input.workspaceId },
    });
    if (clientIdentityExists) {
      throw new Error('Client identity already exists');
    }
    return this.repository.create(input);
  }

  async deleteIdentity({ id, workspaceId }: { id: number, workspaceId: number }) {
    const identityExists = await this.repository.findOne({
      where: { id: id, workspaceId: workspaceId },
    });
    if (!identityExists) throw new Error(`Identity does not exist!`);
    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Identity does not exist!`);
    return identityExists;
  }

  async findByPk(id: number) {
    return this.repository.findByPk(id);
  }

  async findOne(input: InputAWSSesClientIdentityInterface) {
    const identityList = await this.repository.findOne({
      where: { identity: input.identity, workspaceId: input.workspaceId },
    });
    if (!identityList) throw new Error('Identity does not exist');

    return identityList;
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
  }: ArgsAWSSesClientIdentitiyInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: AWSSesClientIdentitiyInterface[];
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
          columns: ['identity'],
        }),
      };
    }
    if (workspaceId) {
      where = { ...where, workspaceId: workspaceId };
    }
    if (status) {
      where = { ...where, status: status };
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

    return { cursorCount, count, rows };
  }

  async updateOne({ id, input }: { id: number, input: Partial<InputAWSSesClientIdentityInterface>}) {
    const clientIdentityExists = await this.repository.findByPk(id);
    if (!clientIdentityExists) throw new Error(`Aws Ses Client Identity: ${id} does not exist!`);
    return this.repository.updateOne({ id, input });
  }

}