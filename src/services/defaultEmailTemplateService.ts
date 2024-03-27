import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import slug from 'slug';
import { SequlizeQueryGenerator } from '../helpers';

import {
  ArgsDefaultEmailTemplateInterface,
  DefaultEmailTemplateInterface,
  InputDefaultEmailTemplateInterface,
} from '../interfaces';
import { DefaultEmailTemplateRepository } from '../repositories';

export class DefaultEmailTemplateService {
  private repository: DefaultEmailTemplateRepository;

  constructor() {
    this.repository = new DefaultEmailTemplateRepository();
  }

  async create(input: InputDefaultEmailTemplateInterface): Promise<DefaultEmailTemplateInterface> {
    const defaultEmailTemplateSlug = slug(input.name);
    const defaultEmailTemplateSlugExits = await this.repository.findOne({
      where: { slug: defaultEmailTemplateSlug, messagingPlatform:input.messagingPlatform  },
    });
    if (defaultEmailTemplateSlugExits) throw new Error(`Default Email Template : ${input.name} already exist!`);
    input.slug = defaultEmailTemplateSlug;
    return this.repository.create(input);
  }

  findAndCountAll({ offset, limit, query, sort, order,messagingPlatform  }: ArgsDefaultEmailTemplateInterface): Promise<{
    count: number;
    rows: DefaultEmailTemplateInterface[];
  }> {
    let where: WhereOptions<any> = {};
    if (query) {
      where = {
        ...where,
        [Sequelize.Op.or]: SequlizeQueryGenerator.searchRegex({
          query,
          columns: ['name'],
        }),
      };
    }
    if(messagingPlatform) {
      where = { ...where, messagingPlatform: messagingPlatform };
    }
    return this.repository.findAndCountAll({
      where,
      offset,
      limit,
      order: [[order, sort]],
      distinct: true,
    });
  }
  async findByPk(id: number): Promise<DefaultEmailTemplateInterface> {
    const defaultEmailTemplateExists = await this.repository.findByPk(id);
    if (!defaultEmailTemplateExists) throw new Error(` Default Email Template: ${id} does not exist`);
    return defaultEmailTemplateExists;
  }

  async updateOne(id: number, input: InputDefaultEmailTemplateInterface): Promise<DefaultEmailTemplateInterface> {
    const defaultEmailTemplateSlug = slug(input.name.toString());
    const defaultEmailTemplateExists = await this.repository.findByPk(id);
    if (!defaultEmailTemplateExists) throw new Error(`Default Email Template ${id} does not exist`);
    if (input.name) {
      const defaultEmailTemplateSlugExits = await this.repository.findOne({
        where: { slug: defaultEmailTemplateSlug },
      });
      if (defaultEmailTemplateSlugExits) throw new Error(`Default Email Template : ${input.name} already exist!`);
      input.slug = defaultEmailTemplateSlug;
    }
    const [update] = await this.repository.updateOne({ id, input });
    if (update === 0) throw new Error(`Default Email registry : ${id} does not exist`);
    return this.findByPk(id);
  }
  async deleteOne(id: number): Promise<boolean> {
    const defaultEmailTemplateExists = await this.repository.findByPk(id);
    if (!defaultEmailTemplateExists) throw new Error(`Default email template: ${id} does not exist`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Default Email Template: ${id} does not exist`);
    return true;
  }
}
