import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { SequlizeQueryGenerator } from '../helpers';
import { ArgsAttributeValuesInterface, AttributeValueInterface, InputAttributeValueInterface } from '../interfaces';
import { Attribute } from '../core/models';
import { AttributeValueRepository } from '../repositories';
import slug from 'slug';
export class AttributeValueService {
  private repository: AttributeValueRepository;

  constructor() {
    this.repository = new AttributeValueRepository();
  }

  async create(input: InputAttributeValueInterface): Promise<AttributeValueInterface> {
    const attributeValueSlug = slug(input.value);
    const attributeValueSlugExits = await this.repository.findOne({
      where: { slug: attributeValueSlug },
    });
    if (attributeValueSlugExits) throw new Error(`Attribute Value Name  : ${input.value} already exist!`);
    input.slug = attributeValueSlug;
    return this.repository.create(input);
  }

  findAll(where?: WhereOptions<any>): Promise<AttributeValueInterface[]> {
    return this.repository.findAll({ where });
  }

  findAndCountAll({
    offset,
    limit,
    query,
    sort,
    order,
    attributeId,
    attributeName,
  }: ArgsAttributeValuesInterface): Promise<{
    count: number;
    rows: AttributeValueInterface[];
  }> {
    let where: WhereOptions<any> = {};
    let attributeWhere: WhereOptions<any> = {};

    if (query) {
      where = {
        ...where,
        [Sequelize.Op.or]: SequlizeQueryGenerator.searchRegex({
          query,
          columns: ['value', 'description'],
        }),
      };
    }

    if (attributeId) {
      where = { ...where, attribute_id: attributeId };
    }

    if (attributeName) {
      attributeWhere = { ...attributeWhere, name: attributeName };
    }

    return this.repository.findAndCountAll({
      where,
      offset,
      limit,
      order: [[order, sort]],
      distinct: true,
      include: [
        {
          model: Attribute,
          as: 'attribute',
          attributes: ['id', 'name'],
          where: attributeWhere,
        },
      ],
    });
  }

  async findByPk(id: number): Promise<AttributeValueInterface> {
    const attributeValueExists = await this.repository.findByPk(id);
    if (!attributeValueExists) throw new Error(`Attribute Value: ${id} does not exist!`);
    return attributeValueExists;
  }

  async updateOne(id: number, input: InputAttributeValueInterface): Promise<AttributeValueInterface> {
    const attributeValueExists = await this.repository.findByPk(id);
    if (!attributeValueExists) throw new Error(`Attribute Value: ${id} does not exist!`);

    const update = await this.repository.updateOne({ id, input });
    if (!update) throw new Error(`Attribute Value: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }

  async deleteOne(id: number): Promise<boolean> {
    const attributeValueExists = await this.repository.findByPk(id);
    if (!attributeValueExists) throw new Error(`Attribute Value: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Attribute Value: ${id} does not exist!`);
    return true;
  }
  async findOne(input: string) {
    const attributeValueSlug = slug(input)
    const attributeValueExists = await this.repository.findOne({
      where: { slug: attributeValueSlug},
    });
    if (!attributeValueExists) throw new Error(`Sorry! ${input} does not exist!`)
    return attributeValueExists;
  }
}
