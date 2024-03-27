import { WhereOptions, Sequelize } from 'sequelize';
import { ServiceEnum } from '../enums';
import { TransactionLogInterface, InputTransactionLogInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { TestTransactionLogRepository, ServiceRepository } from '../repositories';

export class TransactionLogService {
  private repository: TestTransactionLogRepository;
  private serviceRepository: ServiceRepository;
  constructor() {
    this.repository = new TestTransactionLogRepository();
    this.serviceRepository = new ServiceRepository();
  }

  async create(input: InputTransactionLogInterface): Promise<TransactionLogInterface> {
    if (input.service) {
      const service = await this.serviceRepository.findOne({
        where: { slug: input.service },
      });
      input.serviceId = service.id;
    }
    console.info('TRANSACTION LOG INPUT: =>', input)
    return this.repository.create(input);
  }

  async findByPk(id: number): Promise<TransactionLogInterface> {
    const transaction = await this.repository.findByPk(id, {
      include: [
        {
          model: Model.Service,
          as: 'service',
        },
      ],
    });
    if (!transaction) throw new Error(`TransactionLog: ${id} does not exist!`);
    return transaction;
  }

  async update({
    input,
    workspaceId,
    service,
    campaignScheduleId,
    batchSanitizeEmailRegistryGroupId,
  }: {
    input: Partial<InputTransactionLogInterface>;
    workspaceId: number;
    service: ServiceEnum;
    campaignScheduleId?: number;
    batchSanitizeEmailRegistryGroupId?: number;
  }): Promise<[number]> {
    let where: WhereOptions<any> = {};
    where = {
      ...where,
      workspaceId,
    };
    if(campaignScheduleId) {
      where = {
        ...where, campaignScheduleId
      }
    }
    if(batchSanitizeEmailRegistryGroupId) {
      where = {
        ...where, batchSanitizeEmailRegistryGroupId
      }
    }
    const serviceExists = await this.serviceRepository.findOne({ where: { slug: service } });
    if (serviceExists) {
      where = {
        ...where,
        serviceId: serviceExists.id,
      };
    }
    const log = await this.repository.findOne({
      where: where,
    });
    if (!log) {
      throw new Error('Invalid transaction log ID');
    }
    return this.repository.updateOne({ id: log.id, input: input });
  }

  async availableBalance({
    workspaceId,
    service,
  }: {
    workspaceId: number;
    service: ServiceEnum;
  }): Promise<TransactionLogInterface[]> {
    let where: WhereOptions<any> = {};

    where = {
      releaseBalance: false,
    };
    if (workspaceId) {
      where = {
        ...where,
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
      group: ['workspaceId'],
      attributes: ['workspaceId', [Sequelize.literal('COALESCE(SUM("amount"), 0)'), 'availableBalance']],
    });
  }
}
