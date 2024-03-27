import { InputModuleInterface, ModuleInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class ModuleRepository extends BaseRepository<InputModuleInterface, ModuleInterface> {
  constructor() {
    super(Model.Module);
  }
}
