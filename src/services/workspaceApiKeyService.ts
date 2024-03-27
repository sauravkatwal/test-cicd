import { WorkspaceApiKeyInterface, InputWorkspaceApiKeyInterface, ArgsWorkspaceApiKeyInterface } from "../interfaces";
import { WorkspaceApiKeyRepository } from '../repositories';
import { defaultCursor } from '../config';
import { SortEnum } from '../enums';
import { WhereOptions } from 'sequelize';
import * as Sequelize from 'sequelize';
import { SequlizeQueryGenerator } from '../helpers';

export class WorkspaceApiKeyService {
  private repository: WorkspaceApiKeyRepository;

  constructor() {
    this.repository = new WorkspaceApiKeyRepository();
  }

  async create(input: InputWorkspaceApiKeyInterface): Promise<WorkspaceApiKeyInterface> {
    return this.repository.create(input);
  }

  async updateOne(id: number, input: Partial<InputWorkspaceApiKeyInterface>): Promise<WorkspaceApiKeyInterface> {
    const workspaceApiKeyExists = await this.repository.findByPk(id);
    if (!workspaceApiKeyExists) {
      throw new Error(`Workspace Api Key: ${id} does not exist!`);
    }
    const update = await this.repository.updateOne({ id, input });
    if (update[0] === 0) throw new Error(`Workspace Api Key: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }

  async deleteOne(id: number): Promise<boolean> {
    const workspaceApiKeyExists = await this.repository.findByPk(id);
    if (!workspaceApiKeyExists) throw new Error(`Workspace Api Key: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Workspace Api key: ${id} does not exist!`);
    return true;
  }

  findOne({ apiKey }: { apiKey?: string }): Promise<WorkspaceApiKeyInterface> {
    let where: WhereOptions<any> = {};
    if (apiKey) {
      where = { ...where, apiKey: apiKey };
    }
    return this.repository.findOne({ where });

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
    enable
  }: ArgsWorkspaceApiKeyInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: WorkspaceApiKeyInterface[];
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
    if (enable) {
      where = { ...where, enable: enable };
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
      }),
    ]);
    return { rows, count, cursorCount };
  }
}


