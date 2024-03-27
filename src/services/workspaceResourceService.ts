import { WhereOptions } from 'sequelize';
import {
  WorkspaceResourceInterface,
  InputWorkspaceResourceInterface,
  ModelsInterface,
} from '../interfaces';
import {
  WorkspaceResourceRepository,
} from '../repositories';

export class WorkspaceResourceService {
  private models: ModelsInterface;
  private repository: WorkspaceResourceRepository;
  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new WorkspaceResourceRepository(this.models);
  }

  async findOne(input: Partial<InputWorkspaceResourceInterface>): Promise<WorkspaceResourceInterface> {
    let where: WhereOptions<any> = {};

    where = { ...where, isActive: true };

    if (input.workspaceId) where = { ...where, workspaceId: input.workspaceId };
    if (input.type) where = { ...where, type: input.type };
    if (input.purpose) where = { ...where, purpose: input.purpose };

    return this.repository.findOne({ where });
  }
}
