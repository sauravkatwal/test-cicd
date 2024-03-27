import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { InputUserWorkspaceInterface, ModelsInterface, UserWorkspaceInterface, UserWorkspaceRoleInterface } from '../interfaces';
import { User } from '../core/models';
import { RoleRepository, UserWorkspaceRepository, UserWorkspaceRoleRepository, ScreenRepository, ModuleRepository, PrivilegeRepository } from '../repositories';
import { RoleEnum, UserWorkspaceStatusEnum } from '../enums';

export class UserWorkspaceService {
  private models: ModelsInterface;
  private repository: UserWorkspaceRepository;
  private roleRepository: RoleRepository | undefined;
  private userWorkspaceRoleRepository: UserWorkspaceRoleRepository | undefined;
  private privilegeRepository: PrivilegeRepository;
  private moduleRepository: ModuleRepository;
  private screenRepository: ScreenRepository;


  constructor(models?: ModelsInterface) {
    this.models = models!;
    this.repository = new UserWorkspaceRepository();
    this.roleRepository = this.models ? new RoleRepository(this.models) : undefined;
    this.userWorkspaceRoleRepository = this.models ? new UserWorkspaceRoleRepository(this.models) : undefined;
    this.privilegeRepository = new PrivilegeRepository();
    this.moduleRepository = new ModuleRepository();
    this.screenRepository = new ScreenRepository();
  }

  async create(input: InputUserWorkspaceInterface): Promise<UserWorkspaceInterface> {
    let where: WhereOptions<any> = {};
    where = {
      ...where, slug:input.role
    }
    if (input.workspace_id && input.role !== RoleEnum.owner) {
      where = { ...where, workspaceId: input.workspace_id };
    }
    const rolesExists = await this.roleRepository!.findOne({
      where: where
    });

    if (!rolesExists) {
      throw new Error(`Role: ${input.role}  does not exist!`);
    }

    const data = await this.repository.create(input);
    await this.userWorkspaceRoleRepository!.create({
      role_id: rolesExists.id,
      user_workspace_id: data.id
    });

    return data;
  }

  async find(workspaceId: number, userId: number) : Promise<UserWorkspaceRoleInterface> {
    const userWorkspace = await this.repository.findOne({
      where: { workspace_id: workspaceId, user_id: userId },
    });

    const userWorkspaceRole = await this.userWorkspaceRoleRepository!.findOne({
      where: { user_workspace_id: userWorkspace.id },
      include: [
        {
          model: this.models.Role,
          as: 'role',
          attributes: ['id', 'label', 'slug'],
          include: [
            {
              model: this.models.ScreenRoleMapping,
              as: 'roleMaps',
              attributes: ['id','screenId','moduleId','privilegeId','roleId','is_active'],
            }
          ]
        },
      ],
    });

    const response = userWorkspaceRole.role!.roleMaps!.map(async item => {
      const module = await this.moduleRepository.findOne({
        where: { id: item.moduleId!},
        attributes: ['id', 'name', 'slug', 'isDefault'],
      });
      const screen = await this.screenRepository.findOne({
        where: { id: item.screenId!},
        attributes: ['id', 'name', 'slug', 'isDefault', 'status', 'description'],
      });
      const privilege = await this.privilegeRepository.findOne({
        where: {id: item.privilegeId!},
        attributes: ['id', 'name', 'slug', 'isDefault'],
      });
  
      item.module = module;
      item.privilege = privilege;
      item.screen = screen;
    })
    await Promise.all(response);

    return userWorkspaceRole;
  }

  findOne({
    user_id,
    workspace_id,
    email,
  }: {
    user_id?: number;
    workspace_id?: number;
    email?: string;
  }): Promise<UserWorkspaceInterface> {
    let where: WhereOptions<any> = {};
    let userWhere: WhereOptions<any> = {};
    if (user_id) {
      where = { ...where, user_id: user_id };
    }
    if (workspace_id) {
      where = { ...where, workspace_id: workspace_id };
    }
    if (email) {
      userWhere = { ...userWhere, email: email };
    }
    return this.repository.findOne({
      where: where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'sub'],
          where: userWhere,
        },
      ],
    });
  }

  async findByPk(id: number)  : Promise<UserWorkspaceInterface>{
    return this.repository.findByPk(id);
  }

  async updateOne(
    id: Sequelize.CreationOptional<number>,
    input: Partial<InputUserWorkspaceInterface>,
  ): Promise<number[]> {
    if (id) {
      const userExists = await this.repository.findByPk(id);
      if (!userExists) throw new Error(`User workspace : ${id} does not exist!`);
    }
    return this.repository.updateOne({
      id: id,
      input: input,
    });
  }

  async count({
    workspaceId,
    userWorkspaceStatus,
    fromDate,
    toDate,
  }: {
    workspaceId: number;
    userWorkspaceStatus?: UserWorkspaceStatusEnum;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<number> {
    let where: WhereOptions<any> = {};
    if (workspaceId) {
      where = { ...where, workspace_id: workspaceId };
    }
    if (userWorkspaceStatus) {
      where = { ...where, status: userWorkspaceStatus };
    }
    if (fromDate && toDate) {
      where = { ...where,  createdAt: {
        [Sequelize.Op.between]: [fromDate, new Date(toDate + 'T23:59:59.999Z')],
      }    
     };
    };
    return this.repository.count({ where });
  }

  async deleteOne(id: number): Promise<boolean> {
    const memberExists = await this.repository.findByPk(id);
    if (!memberExists) throw new Error(`Member: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Member: ${id} does not exist!`);
    return true;
  }
}
