import { InputServiceRateInterface, ServiceRateInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class ServiceRateRepository extends BaseRepository<InputServiceRateInterface, ServiceRateInterface> {
  constructor() {
    super(Model.ServiceRate);
  }
}
