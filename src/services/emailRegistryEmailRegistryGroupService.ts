import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { EmailRegistryEmailRegistryGroupInterface, InputEmailRegistryEmailRegistryGroupInterface, ModelsInterface } from '../interfaces';
import {
  EmailRegistryEmailRegistryGroupRepository,
  EmailRegistryGroupRepository,
  EmailRegistryRepository,
} from '../repositories';

export class EmailRegistryEmailRegistryGroupService {
  private models: ModelsInterface;
  private repository: EmailRegistryEmailRegistryGroupRepository;
  private emailRegistryRepository: EmailRegistryRepository;
  private emailRegistryGroupRepository: EmailRegistryGroupRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new EmailRegistryEmailRegistryGroupRepository(this.models);
    this.emailRegistryRepository = new EmailRegistryRepository(this.models);
    this.emailRegistryGroupRepository = new EmailRegistryGroupRepository(this.models);
  }

  async create(
    input: InputEmailRegistryEmailRegistryGroupInterface,
  ): Promise<EmailRegistryEmailRegistryGroupInterface> {
    const emailRegistryExists = await this.emailRegistryRepository.findOne({
      where: { id: input.emailRegistryId },
    });

    if (!emailRegistryExists) {
      throw new Error(`Email registry id: ${input.emailRegistryId}  does not exist!`);
    }

    const emailRegistryGroupExists = await this.emailRegistryGroupRepository.findOne({
      where: { id: input.emailRegistryGroupId },
    });

    if (!emailRegistryGroupExists) {
      throw new Error(`Email registry group id: ${input.emailRegistryGroupId}  does not exist!`);
    }
    return this.repository.create(input);
  }

  async bulkCreate(
    input: InputEmailRegistryEmailRegistryGroupInterface[],
  ): Promise<EmailRegistryEmailRegistryGroupInterface[]> {
    return this.repository.bulkCreate(input);
  }

  findOne(
    filter: Partial<InputEmailRegistryEmailRegistryGroupInterface>,
  ): Promise<EmailRegistryEmailRegistryGroupInterface> {
    let where: WhereOptions<any> = {};
    if (filter?.emailRegistryId) {
      where = { ...where, emailRegistryId: filter.emailRegistryId };
    }
    if (filter?.emailRegistryGroupId) {
      where = {
        ...where,
        emailRegistryGroupId: filter.emailRegistryGroupId,
      };
    }
    return this.repository.findOne({
      where: where,
    });
  }

  async updateOne(
    id: Sequelize.CreationOptional<number>,
    input: Partial<InputEmailRegistryEmailRegistryGroupInterface>,
  ): Promise<number[]> {
    if (id) {
      const EmailRegistryEmailRegistryGroupExists = await this.repository.findByPk(id);
      if (!EmailRegistryEmailRegistryGroupExists) throw new Error(`User workspace : ${id} does not exist!`);
    }
    return this.repository.updateOne({
      id: id,
      input: input,
    });
  }

  deleteMany(filter: Partial<InputEmailRegistryEmailRegistryGroupInterface>): Promise<number> {
    let where: WhereOptions<any> = {};
    if (filter?.emailRegistryId) {
      where = { ...where, emailRegistryId: filter.emailRegistryId };
    }
    if (filter?.emailRegistryGroupId) {
      where = {
        ...where,
        emailRegistryGroupId: filter.emailRegistryGroupId,
      };
    }
    return this.repository.deleteMany({
      where,
    });
  }
}
