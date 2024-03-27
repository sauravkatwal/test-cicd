import KSUID from 'ksuid';
import { WhereOptions } from 'sequelize';
import * as Sequelize from 'sequelize';
import { ServiceEnum, SortEnum, UserWorkspaceStatusEnum } from '../enums';
import { InputWorkspaceInterface, WorkspaceInterface, ArgsWorkspaceInterface } from '../interfaces';
import { Address, Company, User, UserWorkspace } from '../core/models';
import { WorkspaceRepository } from '../repositories';
import { defaultCursor } from '../config';
import { SequlizeQueryGenerator } from '../helpers';
import Model from '../core/models/index-new';
import { GraphQLError } from 'graphql';

export class WorkspaceService {
  private repository: WorkspaceRepository;

  constructor() {
    this.repository = new WorkspaceRepository();
  }

  async create(input: InputWorkspaceInterface): Promise<WorkspaceInterface> {
    const workspaceExists = await this.repository.findOne({
      where: { label: input.label },
    });
    if (workspaceExists) {
      throw new GraphQLError(`Workspace: ${input.label} already exist!`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'label',
          http: {
            status: 200,
          },
        },
      });
    }

    input.secret = KSUID.randomSync().string;
    const data = await this.repository.create(
      {
        ...input,
        workspace_users: [
          {
            user_id: input.owner_id,
            status: UserWorkspaceStatusEnum.accepted,
          },
        ],
      },
      {
        include: [
          {
            model: UserWorkspace,
            as: 'workspace_users',
          },
        ],
      },
    );

    return data;
  }

  findOne({ secret, owner_id }: { secret?: string, owner_id?: number }): Promise<WorkspaceInterface> {
    let where: WhereOptions<any> = {};
    if (secret) {
      where = { ...where, secret: secret };
    }
    if (owner_id) {
      where = { ...where, owner_id: owner_id };
    }
    return this.repository.findOne({ where });

  }

  findAll(where?: WhereOptions<any>): Promise<WorkspaceInterface[]> {
    return this.repository.findAll({ where });
  }

  async findByPk(id: number): Promise<WorkspaceInterface> {
    const workspaceExists = await this.repository.findByPk(id, {
      include: [
        {
          model: Model.PointOfContacts,
          as: 'pointOfContact'
        },
        {
          model: Company,
          as: 'company',
          include: [
            {
              model: Address,
              as: 'address'
            }
          ]
        },
        {
          model: User,
          as: 'owner'
        }
      ]
    });
    if (!workspaceExists) throw new Error(`Workspace: ${id} does not exist!`);
    return workspaceExists;
  }

  async updateOne(id: number, input: Partial<InputWorkspaceInterface>): Promise<WorkspaceInterface> {
    const workspaceExists = await this.repository.findByPk(id);
    if (!workspaceExists) throw new Error(`Workspace: ${id} does not exist!`);

    const [update] = await this.repository.updateOne({ id, input });
    if (update === 0) throw new Error(`Workspace: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }
  async deleteOne(id: number): Promise<boolean> {
    const workspaceExists = await this.repository.findByPk(id);
    if (!workspaceExists) throw new Error(`Workspace: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Workspace: ${id} does not exist!`);
    return true;
  }


  async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
  }: ArgsWorkspaceInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: any[];
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
          columns: ['label'],
        }),
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
            model: Model.PointOfContacts,
            as: 'pointOfContact'
          },
          {
            model: Company,
            as: 'company',
            include: [
              {
                model: Address,
                as: 'address'
              }
            ]
          },
          {
            model: User,
            as: 'owner'
          }
        ]
      }),
    ]);

    return { rows, count, cursorCount };
  }

  async getCreditsUsageSummary({
    workspaceId,
    fromDate,
    toDate,
  }: {
    workspaceId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<[any]> {
    const params = `:workspaceId, :fromDate, :toDate`;
    return this.repository.query({
      functionName: `get_workspace_credits_usage_summary`,
      where: { workspaceId, fromDate, toDate, },
      params: params,
    });
  }

  async getCreditsUsageDetails({
    workspaceId,
    fromDate,
    toDate,
    service
  }: {
    workspaceId: number;
    fromDate: Date;
    toDate: Date;
    service: ServiceEnum
  }): Promise<[any]> {
    const params = `:workspaceId, :fromDate, :toDate, :service`;
    return this.repository.query({
      functionName: `get_workspace_credits_usage_details`,
      where: { workspaceId, fromDate, toDate, service },
      params: params,
    });
  }
}
