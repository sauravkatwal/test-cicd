import { BaseRepository } from './baseRepository';
import {
  InputWorkspaceResourceInterface,
  WorkspaceResourceInterface,
  ModelsInterface
} from '../interfaces';

export class WorkspaceResourceRepository extends BaseRepository<InputWorkspaceResourceInterface, WorkspaceResourceInterface> {
  constructor(models: ModelsInterface) {
    super(models.WorkspaceResource);
  }
}
