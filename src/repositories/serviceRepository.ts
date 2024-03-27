import { InputServiceInterface, ServiceInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class ServiceRepository extends BaseRepository<InputServiceInterface, ServiceInterface> {
  constructor() {
    super(Model.Service);
  }
}
