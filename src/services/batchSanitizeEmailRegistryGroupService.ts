import { WhereOptions } from 'sequelize';
import {
  BatchSanitizeEmailRegistryGroupInterface,
  InputBatchSanitizeEmailRegistryGroupInterface,
  InputBatchSanitizeEmailRegistryInterface,
  ModelsInterface,
} from '../interfaces';
import { BatchSanitizeEmailRegistryGroupRepository, BatchSanitizeEmailRegistryRepository } from '../repositories';

export class BatchSanitizeEmailRegistryGroupService {
  private models: ModelsInterface;
  private repository: BatchSanitizeEmailRegistryGroupRepository;
  private batchSanitizeEmailRegistryRepository: BatchSanitizeEmailRegistryRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new BatchSanitizeEmailRegistryGroupRepository(this.models);
    this.batchSanitizeEmailRegistryRepository = new BatchSanitizeEmailRegistryRepository(this.models);
  }

  async create(
    input: InputBatchSanitizeEmailRegistryGroupInterface,
  ): Promise<BatchSanitizeEmailRegistryGroupInterface> {
    let batchSanitizeEmailRegistries: InputBatchSanitizeEmailRegistryInterface[] = [];
    let result;
    try {
      result = await this.models.BatchSanitizeEmailRegistryGroup.sequelize!.transaction(async (transaction) => {
        const batchSanitizeEmailRegistryGroup = await this.repository.create(input, undefined, { transaction });
        if (input.emailRegistries) {
          batchSanitizeEmailRegistries = input.emailRegistries.map((item) => {
            return {
              emailRegistryId: item.id,
              batchSanitizeEmailRegistryGroupId: batchSanitizeEmailRegistryGroup.id,
              workspaceId: input.workspaceId,
            };
          });
          await this.batchSanitizeEmailRegistryRepository.bulkCreate(batchSanitizeEmailRegistries, { transaction });
        }
        return batchSanitizeEmailRegistryGroup;
      });
    } catch (error) {
      throw new Error('Something went wrong!! Please try again');
    }
    return result;
  }

  async update(id: number) {
    return this.repository.update({
      where: {
        id: id,
      },
      input: { status: 'completed' },
    });
  }

  async findAll({ status }: { status: string }): Promise<BatchSanitizeEmailRegistryGroupInterface[]> {
    let where: WhereOptions = {};

    if (status) {
      where = { ...where, status: status };
    }

    return this.repository.findAll({});
  }
}
