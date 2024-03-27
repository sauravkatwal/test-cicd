import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { SequlizeQueryGenerator } from '../helpers';
import { ArgsAttributesInterface, AttributeInterface, InputAttributeInterface } from '../interfaces';
import { AttributeRepository } from '../repositories';
import AttributeValues from '../core/models/attributeValue';

export class AttributeService {
  private repository: AttributeRepository;

  constructor() {
    this.repository = new AttributeRepository();
  }

  async create(input: InputAttributeInterface): Promise<AttributeInterface> {
    return this.repository.create(input);
  }

  findAll(where?: WhereOptions<any>): Promise<AttributeInterface[]> {
    return this.repository.findAll({
      where,
      include: [
        {
          model: AttributeValues,
          as: 'attributeValues',
        }]
    });
  }

  findAndCountAll({ offset, limit, query, sort, order }: ArgsAttributesInterface): Promise<{
    count: number;
    rows: AttributeInterface[];
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

  async findByPk(id: number): Promise<AttributeInterface> {
    const attributeExists = await this.repository.findByPk(id);
    if (!attributeExists) throw new Error(`Attribute: ${id} does not exist!`);
    return attributeExists;
  }

  async updateOne(id: number, input: InputAttributeInterface): Promise<AttributeInterface> {
    const atrributeExists = await this.repository.findByPk(id);
    if (!atrributeExists) throw new Error(`Attribute: ${id} does not exist!`);

    const update = await this.repository.updateOne({ id, input });
    if (!update) throw new Error(`Attribute: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }

  async deleteOne(id: number): Promise<boolean> {
    const atrributeExists = await this.repository.findByPk(id);
    if (!atrributeExists) throw new Error(`Attribute: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Attribute: ${id} does not exist!`);
    return true;
  }
}
