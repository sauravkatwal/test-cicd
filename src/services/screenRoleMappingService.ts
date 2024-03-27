import { WhereOptions } from 'sequelize';
import * as Sequelize from 'sequelize';
import {
  ArgsScreenRoleMappingInterface,
  InputScreenRoleMappingSlugInterface,
  ScreenRoleMappingInterface,
  ModelsInterface
} from '../interfaces';
import {
  PrivilegeRepository,
  RoleRepository,
  ScreenRoleMappingRepository,
  ScreenRepository,
  ModuleRepository,
} from '../repositories';
import Model from '../core/models/index-new';
import { SortEnum } from '../enums';
import { defaultCursor } from '../config';

export class ScreenRoleMappingService {
  private models: ModelsInterface;
  private repository: ScreenRoleMappingRepository;
  private roleRepository: RoleRepository;
  private privilegeRepository: PrivilegeRepository;
  private screenRepository: ScreenRepository;
  private moduleRepository: ModuleRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new ScreenRoleMappingRepository(this.models);
    this.privilegeRepository = new PrivilegeRepository();
    this.roleRepository = new RoleRepository(this.models);
    this.screenRepository = new ScreenRepository();
    this.moduleRepository = new ModuleRepository();
  }

  async create(roleId: number, input: InputScreenRoleMappingSlugInterface): Promise<void> {
    const privilegeExists = await this.privilegeRepository.findOne({
      where: {
        slug: input.privilegeSlug,
      },
      include: [
        {
          model: Model.Module,
          as: 'module',
          attributes: ['id', 'name', 'isDefault'],
          include: [
            {
              model: Model.Screen,
              as: 'screen',
              attributes: ['id', 'name', 'slug'],
            },
          ],
        },
      ],
    });

    if (!privilegeExists) {
      throw new Error(`Privilege: Privilege does not exists`);
    }

    const roleExists = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!roleExists) {
      throw new Error(`Role Id: Role does not exists`);
    }

    const roleMapExists = await this.repository.findOne({
      where: {
        moduleId: privilegeExists.moduleId,
        screenId: privilegeExists.module?.screen?.id,
        privilegeId: privilegeExists.id,
        roleId: roleId,
      },
    });
    if (roleMapExists) {
      throw new Error(`Role map already exists`);
    }

    await this.repository.create({
      moduleId: privilegeExists.moduleId,
      screenId: privilegeExists.module?.screen?.id,
      privilegeId: privilegeExists.id,
      roleId: roleId,
    });
  }

  async bulkCreate(roleId: number, input: InputScreenRoleMappingSlugInterface[]): Promise<void> {
    const promise = input.map(async (singleInput) => {
      const privilegeExists = await this.privilegeRepository.findOne({
        where: {
          slug: singleInput.privilegeSlug,
        },
        include: [
          {
            model: Model.Module,
            as: 'module',
            attributes: ['id'],
            include: [
              {
                model: Model.Screen,
                as: 'screen',
                attributes: ['id'],
              },
            ],
          },
        ],
      });

      if (!privilegeExists) {
        throw new Error(`Privilege: Privilege does not exists`);
      }

      const roleExists = await this.roleRepository.findOne({ where: { id: roleId } });
      if (!roleExists) {
        throw new Error(`Role Id: Role does not exists`);
      }

      return {
        moduleId: privilegeExists.moduleId,
        screenId: privilegeExists.module?.screen?.id,
        privilegeId: privilegeExists.id,
        roleId: roleId,
        isDefault: false,
        isPublished: true,
        isActive: false,
      };
    });

    const data = await Promise.all(promise);

    const result = await this.repository.bulkCreate(data);
    if (result) {
      await this.repository.update({
        where: {
          privilegeId: { [Sequelize.Op.in]: data.map((item) => item.privilegeId) },
          roleId: roleId,
        },
        input: { isActive: true },
      });

      await this.repository.update({
        where: {
          privilegeId: { [Sequelize.Op.notIn]: data.map((item) => item.privilegeId) },
          roleId: roleId,
        },
        input: { isActive: false },
      });
    }
  }

  async findAll({
    where,
    roleId,
  }: {
    where?: WhereOptions<any>;
    roleId?: number[];
  }): Promise<ScreenRoleMappingInterface[]> {
    if (roleId && roleId.length > 0) {
      where = {
        ...where,
        isActive: true,
        roleId: {
          [Sequelize.Op.in]: roleId,
        },
      };
    }

    const data = await this.repository.findAll({
      where,
      include: [
        {
          model: this.models.Role,
          as: 'role',
          attributes: ['id', 'label', 'slug', 'isDefault', 'isActive', 'position'],
        },
      ],
    });

    const response = data.map(async (row) => {
      const module = await this.moduleRepository.findAll({
        where: { id: row.moduleId! },
        attributes: ['id', 'name', 'slug', 'isDefault'],
      });
      const screen = await this.screenRepository.findAll({
        where: { id: row.screenId! },
        attributes: ['id', 'name', 'slug', 'isDefault', 'status', 'description'],
      });
      const privilege = await this.privilegeRepository.findAll({
        where: { id: row.privilegeId! },
        attributes: ['id', 'name', 'slug', 'isDefault'],
      });

      row.module = module;
      row.privilege = privilege;
      row.screen = screen;
    });
    await Promise.all(response);

    return data;
  }

  async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
    roleId,
    isActive,
  }: ArgsScreenRoleMappingInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: ScreenRoleMappingInterface[];
  }> {
    let where: WhereOptions<any> = {},
      cursorWhere: WhereOptions<any> = {},
      orderItem: Sequelize.Order = [];

    if (cursor) {
      if (cursorSort === SortEnum.desc) {
        cursorWhere = {
          ...cursorWhere,
          [defaultCursor]: { [Sequelize.Op.lt]: cursor },
        };
      } else {
        cursorWhere = {
          ...cursorWhere,
          [defaultCursor]: { [Sequelize.Op.gt]: cursor },
        };
      }
    }
    if (isActive === true || isActive === false) {
      where = {
        ...where,
        isActive: isActive,
      };
    }

    if (roleId) {
      where = {
        ...where,
        roleId: roleId,
      };
    }
    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }

    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }
    const [cursorCount, count, rows] = await Promise.all([
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.count({ where: { ...where } }),
      this.repository.findAll({
        where,
        limit,
        order: orderItem,
        include: [
          {
            model: this.models.Role,
            as: 'role',
            attributes: ['id', 'label', 'slug', 'isDefault', 'isActive', 'position'],
          },
        ],
      }),
    ]);

    const response = rows.map(async (row) => {
      const module = await this.moduleRepository.findAll({
        where: { id: row.moduleId! },
        attributes: ['id', 'name', 'slug', 'isDefault'],
      });
      const screen = await this.screenRepository.findAll({
        where: { id: row.screenId! },
        attributes: ['id', 'name', 'slug', 'isDefault', 'status', 'description'],
      });
      const privilege = await this.privilegeRepository.findAll({
        where: { id: row.privilegeId! },
        attributes: ['id', 'name', 'slug', 'isDefault'],
      });

      row.module = module[0] ?? undefined;;
      row.privilege = privilege[0] ?? undefined;;
      row.screen = screen[0] ?? undefined;

    });
    await Promise.all(response);

    return { cursorCount, count, rows };
  }

  async findOne({
    roleIds,
    screenSlug,
    moduleSlug,
    privilegeSlug,
  }: {
    roleIds?: number[]; 
    screenSlug?: string;
    moduleSlug?: string;
    privilegeSlug?: string;
  }): Promise<ScreenRoleMappingInterface> {
    let where: WhereOptions<any> = {},
      screenSlugWhere: WhereOptions<any> = {},
      moduleSlugWhere: WhereOptions<any> = {},
      privilegeSlugWhere: WhereOptions<any> = {};

    if (screenSlug) {
      screenSlugWhere = { ...where, slug: screenSlug };
    }

    if (moduleSlug) {
      moduleSlugWhere = { ...where, slug: moduleSlug };
    }

    if (privilegeSlug) {
      privilegeSlugWhere = { ...where, slug: privilegeSlug };
    }

    if (roleIds && roleIds.length > 0) {
      where = {
        ...where,
        isActive: true,
        roleId: {
          [Sequelize.Op.in]: roleIds,
        },
      };
    }


    const module = await this.moduleRepository.findOne({
      where: { moduleSlug },
      attributes: ['id', 'name', 'slug', 'isDefault'],
    });
    const screen = await this.screenRepository.findOne({
      where: { screenSlug },
      attributes: ['id', 'name', 'slug', 'isDefault', 'status', 'description'],
    });
    const privilege = await this.privilegeRepository.findOne({
      where: { privilegeSlug },
      attributes: ['id', 'name', 'slug', 'isDefault'],
    });
    if (module) {
      where = { ...where, moduleId: module.id };
    }
    if (screen) {
      where = { ...where, screenId: screen.id };
    }
    if (privilege) {
      where = { ...where, privilegeId: privilege.id };
    }
    const data = await this.repository.findOne({
      where,
      include: [
        {
          model: this.models.Role,
          as: 'role',
          attributes: ['id', 'label', 'slug', 'isDefault', 'isActive', 'position'],
        },
      ],
    });
    data.module = [module];
    data.privilege = [privilege];
    data.screen = [screen];

    return data;
  }
  async bulkUpdate(roleId: number, input: InputScreenRoleMappingSlugInterface[]): Promise<void> {
    const promise = input.map(async (singleInput) => {
      const privilegeExists = await this.privilegeRepository.findOne({
        where: {
          slug: singleInput.privilegeSlug,
        },
        include: [
          {
            model: Model.Module,
            as: 'module',
            attributes: ['id'],
            include: [
              {
                model: Model.Screen,
                as: 'screen',
                attributes: ['id'],
              },
            ],
          },
        ],
      });
  
      if (!privilegeExists) {
        throw new Error(`Privilege: Privilege does not exist`);
      }
  
      const roleExists = await this.roleRepository.findOne({ where: { id: roleId } });
      if (!roleExists) {
        throw new Error(`Role Id: Role does not exist`);
      }
  
      return {
        moduleId: privilegeExists.moduleId,
        screenId: privilegeExists.module?.screen?.id,
        privilegeId: privilegeExists.id,
        roleId: roleId,
        isDefault: false,
        isPublished: true,
        isActive: true,
      };
    });
    const data = await Promise.all(promise);

    const existingPrivilegeIds = data.map((item) => item.privilegeId);
    await this.repository.deleteMany({
      where: {
        privilegeId: { [Sequelize.Op.notIn]: existingPrivilegeIds },
        roleId: roleId,
      },
    });
   
    await this.repository.bulkCreate(data);
  }
  
}
