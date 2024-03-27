import { GraphQLError } from 'graphql';
import * as Sequelize from 'sequelize';
import { InputUserWorkspaceRoleInterface, ModelsInterface } from '../interfaces';
import { RoleRepository, UserWorkspaceRoleRepository } from '../repositories';
export class UserWorkspaceRoleService {
  private models: ModelsInterface;
  private repository: UserWorkspaceRoleRepository;
  private roleRepository: RoleRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new UserWorkspaceRoleRepository(this.models);
    this.roleRepository = new RoleRepository(this.models);
  }

  async updateOne(
    id: Sequelize.CreationOptional<number>,
    input: Partial<InputUserWorkspaceRoleInterface>,
  ): Promise<number[]> {
    if (id) {
      const userWorkspaceRoleExists = await this.repository.findOne({ where: { user_workspace_id: id } });
      if (!userWorkspaceRoleExists)
        throw new GraphQLError(`User workspace role: ${id} does not exist!`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'id',
          },
        });
      id = userWorkspaceRoleExists.id;
    }

    if (input.role) {
      const rolesExists = await this.roleRepository.findOne({ where: { slug: input.role } });

      if (!rolesExists) {
        throw new GraphQLError(`Role: ${input.role}  does not exist!`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'role',
          },
        });
      }
      input.role_id = rolesExists.id;
    }

    return this.repository.updateOne({
      id: id,
      input: input,
    });
  }

  async getWorkspaceUsersCount({
    workspaceId,
    fromDate,
    toDate,
  }: {
    workspaceId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<
    [
      {
        key: string;
        value: number;
      },
    ]
  > {
    const params = `:workspaceId, :fromDate, :toDate`;
    return this.repository.tenantDbQuery({
      functionName: `get_workspace_users_count`,
      where: { workspaceId, fromDate, toDate },
      params: params,
    });
  }
}
