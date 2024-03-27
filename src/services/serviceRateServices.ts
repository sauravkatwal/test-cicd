import { defaultCursor } from '../config';
import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { ServiceEnum, SortEnum } from '../enums';
import { SequlizeQueryGenerator } from '../helpers';
import { ArgsServiceRateInterface, ServiceRateInterface, InputServiceRateInterface } from '../interfaces';
import { ServiceRateRepository, ServiceRepository } from '../repositories';

export class ServiceRateService {
  private repository: ServiceRateRepository;
  private serviceRepository: ServiceRepository;

  constructor() {
    this.repository = new ServiceRateRepository();
    this.serviceRepository = new ServiceRepository();
  }

  async create(input: InputServiceRateInterface): Promise<ServiceRateInterface> {
    if (input.service) {
      const service = await this.serviceRepository.findOne({
        where: { slug: input.service },
      });
      input.serviceId = service.id;
    }
    return this.repository.create(input);
  }

  async findByPk(id: number): Promise<ServiceRateInterface> {
    return this.repository.findByPk(id);
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
    service
  }: ArgsServiceRateInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: ServiceRateInterface[];
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
    if(workspaceId) {
      where = {
        ...where, workspaceId: workspaceId
      }
    }
    if(service) {
      const serviceExists = await this.serviceRepository.findOne({
        where: { slug: service },
      });
      where = {
        ...where, serviceId: serviceExists.id
      }
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

  async findOne({ service, workspaceId, creditUnit }: { service: ServiceEnum; workspaceId: number; creditUnit?: number }): Promise<ServiceRateInterface> {
    let where: WhereOptions<any> = {};
    if(workspaceId) {
      where = {
        ...where, workspaceId: workspaceId
      }
    }
    if (service) {
      const serviceExists = await this.serviceRepository.findOne({
        where: { slug: service },
      });
      where = {
        ...where,
        serviceId: serviceExists.id,
      };
    }
    if (creditUnit) {
      where = {
        ...where,
        creditUnit: creditUnit,
      };
    }

    return this.repository.findOne({ where });
  }

  async updateOne(id: number, input: InputServiceRateInterface): Promise<ServiceRateInterface> {
    const service = await this.serviceRepository.findOne({
      where: { slug: input.service },
    });
    input.serviceId = service.id;

    const update = await this.repository.updateOne({ id, input });
    if (update[0] === 0) throw new Error(`ServiceRate: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }

  async deleteOne(id: number): Promise<boolean> {
    const serviceExists = await this.repository.findByPk(id);
    if (!serviceExists) throw new Error(`ServiceRate: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`ServiceRate: ${id} does not exist!`);
    return true;
  }
}
