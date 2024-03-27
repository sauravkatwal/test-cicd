import { InputUserWorkspaceRoleInterface, ModelsInterface, UserWorkspaceRoleInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';

export class UserWorkspaceRoleRepository extends BaseRepository<
  InputUserWorkspaceRoleInterface,
  UserWorkspaceRoleInterface
> {
  constructor(models: ModelsInterface) {
    super(models.UserWorkspaceRole);
  }
}
