import { InputScreenRoleMappingInterface, ModelsInterface, ScreenRoleMappingInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';

export class ScreenRoleMappingRepository extends BaseRepository<InputScreenRoleMappingInterface, ScreenRoleMappingInterface> {
  constructor(models: ModelsInterface) {
    super(models.ScreenRoleMapping);
  }
}
