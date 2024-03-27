import { WorkspaceApiKeyInterface, InputWorkspaceApiKeyInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class WorkspaceApiKeyRepository extends BaseRepository<
InputWorkspaceApiKeyInterface,
WorkspaceApiKeyInterface
> {
  constructor() {
    super(Model.WorkspaceApiKey);
  }
}