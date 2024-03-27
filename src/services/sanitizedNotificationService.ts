import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { SequlizeQueryGenerator } from '../helpers';
import { SanitizedNotificationInterface, InputSanitizedNotificationInterface, ArgsSanitizedNotificationInterface, ModelsInterface } from '../interfaces';
import { SanitizedNotificationRepository } from '../repositories';

export class SanitizedNotificationService {
  private models: ModelsInterface;
  private repository: SanitizedNotificationRepository;
  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new SanitizedNotificationRepository(this.models);
  }

  async create(input: InputSanitizedNotificationInterface): Promise<SanitizedNotificationInterface> {
    const sanitizedNotificationExist = await this.repository.findOne({
      where: { workspaceId: input.workspaceId }
    });
    if (sanitizedNotificationExist) {
      const updatedProgress = [...sanitizedNotificationExist.logs, ...input.logs];
      await this.repository.updateOne({ id: sanitizedNotificationExist.id, input: { logs: updatedProgress } });
      return await this.repository.findByPk(sanitizedNotificationExist.id);
    } else {
      return await this.repository.create(input);
    }
  }
  async findOne({
    workspaceId,
  }: {
    workspaceId: number
  }): Promise<SanitizedNotificationInterface> {
    let where: WhereOptions<any> = {};
    if (workspaceId) {
      where = { ...where, workspaceId };
    }
    const sanitizedNotificationExist = this.repository.findOne({ where: where });
    if (!sanitizedNotificationExist) throw new Error(`workspace: ${workspaceId}  does not exist`);
    return sanitizedNotificationExist;
  }
  findAndCountAll({ offset, limit, query, sort, order }: ArgsSanitizedNotificationInterface): Promise<{
    count: number;
    rows: SanitizedNotificationInterface[];
  }> {
    let where: WhereOptions<any> = {};

    if (query) {
      where = {
        ...where,
        [Sequelize.Op.or]: SequlizeQueryGenerator.searchRegex({
          query,
          columns: ['name', 'description'],
        }),
      };
    }

    return this.repository.findAndCountAll({
      where,
      offset,
      limit,
      order: [[order, sort]],
      distinct: true,
    });
  }
  async deleteOne(id: number): Promise<boolean> {
    const sanitizedNotificationExist = await this.repository.findByPk(id);
    if (!sanitizedNotificationExist) throw new Error(`Notification id: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Notification id: ${id} does not exist!`);
    return true;
  }
}
