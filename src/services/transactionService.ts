import { Database, defaultCursor } from '../config';
import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { ServiceEnum, SortEnum } from '../enums';
import { SequlizeQueryGenerator } from '../helpers';
import {
  ArgsTransactionInterface,
  TransactionInterface,
  InputTransactionInterface,
  InputTransactionEmailRegistryInterface,
  ModelsInterface,
} from '../interfaces';
import Model from '../core/models/index-new';
import {
  TransactionRepository,
  ServiceRepository,
  EmailRegistryRepository,
  TransactionEmailRegistryRepository,
} from '../repositories';
import { UserService } from '.';

export class TransactionService {
  private models: ModelsInterface;
  private repository: TransactionRepository;
  private serviceRepository: ServiceRepository;
  private emailRegistryRepository: EmailRegistryRepository  | undefined;
  private transactionEmailRegistryRepository: TransactionEmailRegistryRepository;
  constructor(models?: ModelsInterface) {
    this.models = models!;
    this.repository = new TransactionRepository();
    this.serviceRepository = new ServiceRepository();
    this.emailRegistryRepository = this.models ? new EmailRegistryRepository(this.models) : undefined;
    this.transactionEmailRegistryRepository = new TransactionEmailRegistryRepository();
  }

  async create(input: InputTransactionInterface): Promise<TransactionInterface> {
    if (input.service) {
      const service = await this.serviceRepository.findOne({
        where: { slug: input.service },
      });
      input.serviceId = service.id;
    }
    let result;
    let transactionEmailRegistries: InputTransactionEmailRegistryInterface[] = [];
    try {
      result = await Database.sequelize.transaction(async (transaction) => {
        const newTransaction = await this.repository.create(input, undefined, { transaction });
        if (input.emailRegistryIds) {
          const emailRegistries = await this.emailRegistryRepository!.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: input.emailRegistryIds,
              },
              workspaceId: input.workspaceId,
            },
          });
          transactionEmailRegistries = emailRegistries.map((item: { id: any }) => {
            return {
              emailRegistryId: item.id,
              transactionId: newTransaction.id,
            };
          });
          await this.transactionEmailRegistryRepository.bulkCreate(transactionEmailRegistries, { transaction });
        }
        return newTransaction;
      });
    } catch (error) {
      console.error(error)
      throw new Error('Something went wrong!! Please try again');
    }
    return result;
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
    service,
  }: ArgsTransactionInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: TransactionInterface[];
  }> {
    let serviceWhere: WhereOptions<any> = {};
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
          columns: ['name', 'email'],
        }),
      };
    }
    if (workspaceId) {
      where = { ...where, workspaceId: workspaceId };
    }
    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }
    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }
    if (service) {
      serviceWhere = {
        ...serviceWhere,
        slug: service,
      };
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
            model: Model.Service,
            as: 'service',
            attributes: ['id', 'name'],
            ...(Object.keys(serviceWhere).length && {
              where: serviceWhere,
            }),
          },
        ],
      }),
    ]);
    const response = rows.map(async (row) => {
      const user = await new UserService().findByPk(row.transactionById);
      row.transactionBy = user;
    });
    await Promise.all(response);
    return { cursorCount, count, rows };
  }

  async findByPk(id: number): Promise<TransactionInterface> {
    const transaction = await this.repository.findByPk(id, {
      include: [
        {
          model: Model.Service,
          as: 'service',
        },
      ],
    });
    if (!transaction) throw new Error(`Transaction: ${id} does not exist!`);
    return transaction;
  }

  async availableBalance({
    workspaceId,
    service,
  }: {
    workspaceId: number;
    service: ServiceEnum;
  }): Promise<TransactionInterface[]> {
    let where: WhereOptions<any> = {};

    if (workspaceId) {
      where = {
        workspaceId: workspaceId,
      };
    }
    const serviceExists = await this.serviceRepository.findOne({
      where: { slug: service },
    });

    if (serviceExists) {
      where = {
        ...where,
        serviceId: serviceExists.id,
      };
    }

    return this.repository.findAll({
      where: where,
      group: ["workspaceId"],
      attributes: [
        "workspaceId",
        [
          Sequelize.Sequelize.literal(
            'COALESCE(SUM("credit"), 0) - COALESCE(SUM("debit"), 0)'
          ),
          "availableBalance",
        ],
      ],
    });
  }

  async availableServices({
    workspaceId,
  }: {
    workspaceId: number;
  }): Promise<TransactionInterface[]> {
    let where: WhereOptions<any> = {};

    if (workspaceId) {
      where = {
        workspaceId: workspaceId,
      };
    }

    return this.repository.findAll({
      where: where,
      group: ["workspaceId", "serviceId", "service.id",],
      attributes: [
        "workspaceId",
        "serviceId",
        [
          Sequelize.Sequelize.literal(
            'COALESCE(SUM("credit"), 0) - COALESCE(SUM("debit"), 0)'
          ),
          "availableBalance",
        ],
      ],
      include: [
        {
          model: Model.Service,
          as: 'service',
          attributes: [
            "slug"
          ]
        },
      ],
    });
  }
}
