import { InputWorkspaceInterface, WorkspaceInterface } from '../interfaces';
import { Workspace } from '../core/models';
import { BaseRepository } from './baseRepository';

export class WorkspaceRepository extends BaseRepository<InputWorkspaceInterface, WorkspaceInterface> {
  constructor() {
    super(Workspace);
  }
}
