import { CoreRoleInterface, InputCoreRoleInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class CoreRoleRepository extends BaseRepository<InputCoreRoleInterface, CoreRoleInterface> {
  constructor() {
    super(Model.CoreRole);
  }
}
