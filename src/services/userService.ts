import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { SequlizeQueryGenerator } from '../helpers';
import {
  ArgsWorkspaceMembersInterface,
  InputUserInterface,
  ModelsInterface,
  RoleInterface,
  UserInterface,
} from '../interfaces';
import { Company, UserWorkspace, Workspace } from '../core/models';
import Model from '../core/models/index-new';
import {
  UserRepository,
  UserWorkspaceRepository, UserWorkspaceRoleRepository
} from '../repositories';

export class UserService {
  private models: ModelsInterface;
  private repository: UserRepository;
  private userWorkspaceRepository: UserWorkspaceRepository;
  private userWorkspaceRoleRepository: UserWorkspaceRoleRepository | undefined;

  constructor(models?: ModelsInterface) {
    this.models = models!;
    this.repository = new UserRepository();
    this.userWorkspaceRepository = new UserWorkspaceRepository();
    this.userWorkspaceRoleRepository = this.models ? new UserWorkspaceRoleRepository(this.models) : undefined;
  }

  async create(input: InputUserInterface): Promise<UserInterface> {
    let rolesExists: RoleInterface[] = [];
    if (input.email) {
      const emailExists = await this.repository.findOne({
        where: { email: input.email.trim() },
      });
      if (emailExists) throw new Error(`E-mail: ${input.email} is already exists!`);
    }
    if (input.phone_number) {
      const phoneNumberExists = await this.repository.findOne({
        where: { phone_number: input.phone_number },
      });
      if (phoneNumberExists) throw new Error(`Phone Number: ${input.phone_number} is already exists!`);
    }
    return this.repository.create(input);
  }

  async findOne({
    email,
    sub,
    workspace_id,
    phoneNumber,
  }: {
    email?: string;
    sub?: string;
    workspace_id?: number | undefined;
    phoneNumber?: string;
  }): Promise<UserInterface> {
    let where: WhereOptions<any> = {};
    let workspacesWhere: WhereOptions<any> = {};
    if (sub) {
      where = { ...where, sub: sub };
    }
    if (email) {
      where = { ...where, email: email };
    }
    if (phoneNumber) {
      where = { ...where, phone_number: phoneNumber };
    }
    if (workspace_id) {
      workspacesWhere = { ...workspacesWhere, workspace_id: workspace_id };
    }
    const data = await this.repository.findOne({
      where,
      include: [
        {
          model: UserWorkspace,
          as: 'user_workspaces',
          attributes: ['id', 'workspace_id'],
          ...(Object.keys(workspacesWhere).length > 0 && { where: workspacesWhere }),
        },
        {
          model: Model.UserRole,
          as: 'userRole',
          include: [
            {
              model: Model.CoreRole,
              as: 'role',
            },
          ],
        },
      ],
    });

    return data;
  }

  findAll({ where }: { where?: WhereOptions<any> }): Promise<UserInterface[]> {
    return this.repository.findAll({ where });
  }

  async findAndCountAll({
    offset,
    limit,
    query,
    sort,
    order,
    workspace_id,
    status,
  }: ArgsWorkspaceMembersInterface): Promise<{
    count: number;
    rows: UserInterface[];
  }> {
    let where: WhereOptions<any> = {};
    let userWorkspacesWhere: WhereOptions<any> = {};
    if (query) {
      where = {
        ...where,
        [Sequelize.Op.or]: SequlizeQueryGenerator.searchRegex({
          query,
          columns: ['name', 'email', 'phone_number'],
        }),
      };
    }

    if (workspace_id) {
      userWorkspacesWhere = {
        ...userWorkspacesWhere,
        workspace_id: workspace_id,
      };
    }

    if (status) {
      userWorkspacesWhere = { ...userWorkspacesWhere, status: status };
    }

    const data = await this.repository.findAndCountAll({
      where,
      offset,
      limit,
      order: [[order, sort]],
      distinct: true,
      include: [
        {
          model: UserWorkspace,
          as: 'user_workspaces',
          attributes: ['id', 'user_id', 'workspace_id', 'status'],
          where: userWorkspacesWhere,
          include: [
            {
              model: Workspace,
              as: 'workspace',
              attributes: ['id', 'label', 'secret'],
            },
          ],
        },
      ],
    });

    const response = data.rows.map(async (item) => {
      const response = item.user_workspaces.map(async (data) => {
        const userRoles = await this.userWorkspaceRoleRepository!.findAll({
          where: {
            user_workspace_id: data.id,
          },
          attributes: ['id', 'user_workspace_id', 'role_id'],
          include: [
            {
              model: this.models.Role,
              as: 'role',
              attributes: ['id', 'label', 'slug'],
            },
          ],
        });
        data.user_roles = userRoles;
      });
      await Promise.all(response);
    });
    await Promise.all(response);

    return data;
  }

  async findByPk(id: number): Promise<UserInterface> {
    const userExists = await this.repository.findByPk(id, {
      include: [
        {
          model: UserWorkspace,
          as: 'user_workspaces',
          attributes: ['id', 'user_id', 'workspace_id'],
          include: [
            {
              model: Workspace,
              as: 'workspace',
              attributes: ['id', 'label', 'secret'],
              include: [
                {
                  model: Company,
                  as: 'company',
                  attributes: ['id', 'name', 'registration_number'],
                },
              ],
            },
          ],
        },
        {
          model: Model.UserRole,
          as: 'userRole',
          include: [
            {
              model: Model.CoreRole,
              as: 'role',
            },
          ],
        },
      ],
    });
    if (!userExists) throw new Error(`User: ${id} does not exist!`);
    return userExists;
  }

  async updateOne(id: Sequelize.CreationOptional<number>, input: Partial<InputUserInterface>): Promise<UserInterface> {
    let rolesExists: RoleInterface[] = [];
    if (id) {
      const userExists = await this.repository.findByPk(id);
      if (!userExists) throw new Error(`User: ${id} does not exist!`);
    }

    if (input.email) {
      const emailExists = await this.repository.findOne({
        where: { email: input.email.trim() },
      });
      if (emailExists && emailExists.id !== id) throw new Error(`E-mail: ${input.email} is already exists!`);
    }

    if (input.current_workspace_id) {
      const userWorkspaceExists = await this.userWorkspaceRepository.findOne({
        where: { workspace_id: input.current_workspace_id, user_id: id },
      });
      if (!userWorkspaceExists) throw new Error(`Workspace: ${input.current_workspace_id} does not exist!`);
    }

    await this.repository.updateOne({
      id: id,
      input: { ...input },
    });

    return this.findByPk(id);
  }

  async update({ email }: { email?: string }, input: Partial<InputUserInterface>): Promise<[number]> {
    let where: WhereOptions<any> = {};
    if (email) {
      where = { ...where, email: email };
    }
    return this.repository.update({
      where,
      input,
    });
  }

  async deleteOne(id: number): Promise<boolean> {
    const userExists = await this.repository.findByPk(id);
    if (!userExists) throw new Error(`User: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`User: ${id} does not exist!`);
    return true;
  }
}
