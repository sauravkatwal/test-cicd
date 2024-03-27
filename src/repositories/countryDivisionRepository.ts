import { CountryDivisionInterface, InputCountryDivisionInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class CountryDivisionRepository extends BaseRepository<InputCountryDivisionInterface, CountryDivisionInterface> {
  constructor() {
    super(Model.CountryDivision);
  }
}
