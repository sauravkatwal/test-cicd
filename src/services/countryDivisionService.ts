import * as Sequelize from 'sequelize';
import slug from 'slug';
import { WhereOptions } from 'sequelize';
import { SequlizeQueryGenerator } from '../helpers';
import { ArgsCountryDivisionInterface, CountryDivisionInterface } from '../interfaces';
import { CountryDivisionRepository } from '../repositories';

export class CountryDivisionService {
  private repository: CountryDivisionRepository;

  constructor() {
    this.repository = new CountryDivisionRepository();
  }

  async findByPk(id: number): Promise<CountryDivisionInterface> {
    const emailRegistryExists = await this.repository.findByPk(id);
    if (!emailRegistryExists) throw new Error(` Country Division: ${id} does not exist!`);
    return emailRegistryExists;
  }

  async findOne(input: string) {
    const countryDivisionSlug = slug(input)
    const countryDivisionExists = await this.repository.findOne({
      where: { slug: countryDivisionSlug },
    });
    if (!countryDivisionExists) throw new Error(`Sorry! ${input} does not exist!`)
    return countryDivisionExists;
  }

  async findAndCountAll({ offset, limit, query, sort, order, type, state, country }: ArgsCountryDivisionInterface): Promise<{
    count: number;
    rows: CountryDivisionInterface[];
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
    if (type) {
      where = { ...where, type: type };
    }

    if (state) {
      const state_id = parseInt(state)
      if (Number.isNaN(state_id)) {
        const countryDivisionSlug = slug(state);
        const countryDivisionSlugExists = await this.repository.findOne({
          where: { slug: countryDivisionSlug },
        });
        where = { ...where, state_id: countryDivisionSlugExists.id, type: 'district' };
      } else {
        where = { ...where, state_id: state_id, type: 'district' };
      }
    }

    if (country) {
      const country_id = parseInt(country)
      if (Number.isNaN(country_id)) {
        const countryDivisionSlug = slug(country);
        const countryDivisionSlugExists = await this.repository.findOne({
          where: { slug: countryDivisionSlug },
        });
        where = { ...where, country: countryDivisionSlugExists.id, type: 'state' };
      } else {
        where = { ...where, country: country_id, type: 'state' };
      }
    }

    return this.repository.findAndCountAll({
      where,
      order: [[order, sort]],
      distinct: true,
    });
  }

  async findAll({ type, attributes }: { type?: string, attributes?: string[] }): Promise<CountryDivisionInterface[]> {
    let where: WhereOptions<any> = {};
    if (type) where = { ...where, type: type };
    return this.repository.findAll({ where, attributes });
  }
}
