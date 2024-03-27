import { WhereOptions } from 'sequelize';
import slug from 'slug';
import { ArgsRolesInterface, InputRoleInterface, RoleInterface, ModelsInterface } from '../interfaces';
import { RoleRepository, PrivilegeRepository, ModuleRepository, ScreenRepository } from '../repositories';
import { SequlizeQueryGenerator } from '../helpers';
import * as Sequelize from 'sequelize';
import { RoleEnum, SortEnum } from '../enums';
import { defaultCursor } from '../config';

export class RoleService {
  private models: ModelsInterface;
  private repository: RoleRepository;
  private privilegeRepository: PrivilegeRepository;
  private moduleRepository: ModuleRepository;
  private screenRepository: ScreenRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new RoleRepository(this.models);
    this.privilegeRepository = new PrivilegeRepository();
    this.moduleRepository = new ModuleRepository();
    this.screenRepository = new ScreenRepository();
  }

  async create(input: InputRoleInterface): Promise<RoleInterface> {
    const roleSulg = slug(input.label);
    const roleSlugExists = await this.repository.findOne({
      where: { slug: roleSulg, workspaceId: input.workspaceId },
    });
    if (roleSlugExists) throw new Error(`Role: ${input.label} already exist!`);
    input.slug = roleSulg;
    return this.repository.create(input);
  }

  findAll(where?: WhereOptions<any>): Promise<RoleInterface[]> {
    if (where) {
      where = {
        ...where,
      };
    }
    return this.repository.findAll({ where });
  }

  async findAndCountAll({
    cursor,
    limit,
    order,
    sort,
    cursorOrder,
    cursorSort,
    query,
    workspace_id,
  }: ArgsRolesInterface): Promise<{
    count: number;
    cursorCount: number;
    rows: RoleInterface[];
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

    if (query) {
      where = {
        [Sequelize.Op.or]: SequlizeQueryGenerator.searchRegex({
          query,
          columns: ['label', 'slug'],
        }),
      };
    }
    if (order && sort) {
      orderItem = [...orderItem, [order, sort]];
    }
    if (cursorOrder && cursorSort) {
      orderItem = [...orderItem, [cursorOrder, cursorSort]];
    }
    if (workspace_id) {
      where = {
        ...where,
        workspaceId: { [Sequelize.Op.or]: [workspace_id, null] },
      };
    }

    where = {
      ...where,
      slug: { [Sequelize.Op.ne]: RoleEnum.administrator },
    };

    const [cursorCount, count, rows] = await Promise.all([
      this.repository.count({ where: { ...cursorWhere, ...where } }),
      this.repository.count({ where: { ...where } }),
      this.repository.findAll({
        where: { ...cursorWhere, ...where },
        limit,
        order: orderItem,
        include: [
          {
            model: this.models.ScreenRoleMapping,
            as: 'roleMaps',
            attributes: ['id', 'is_default', 'is_published', 'is_active', 'moduleId', 'screenId', 'privilegeId'],
          },
        ],
      }),
    ]);
    const response = rows.map(async (role) => {
      const response = role.roleMaps!.map(async (item) => {
        const module = await this.moduleRepository.findAll({
          where: { id: item.moduleId! },
          attributes: ['id', 'name', 'slug', 'isDefault'],
        });
        const screen = await this.screenRepository.findAll({
          where: { id: item.screenId! },
          attributes: ['id', 'name', 'slug', 'isDefault', 'status', 'description'],
        });
        const privilege = await this.privilegeRepository.findAll({
          where: { id: item.privilegeId! },
          attributes: ['id', 'name', 'slug', 'isDefault'],
        });
        item.module = module;
        item.privilege = privilege;
        item.screen = screen;
      });
      await Promise.all(response);
    });
    await Promise.all(response);

    return { cursorCount, count, rows };
  }

  async findByPk(id: number): Promise<RoleInterface> {
    const roleExists = await this.repository.findByPk(id);
    if (!roleExists) throw new Error(`Role: ${id} does not exist!`);
    return roleExists;
  }

  async updateOne(id: number, input: InputRoleInterface, workspaceId: number): Promise<RoleInterface> {
    const roleSulg = slug(input.label);
    const roleExists = await this.repository.findByPk(id);
    if (!roleExists) throw new Error(`Role: ${id} does not exist!`);

    const roleSlugExists = await this.repository.findOne({
      where: { slug: roleSulg, workspaceId: workspaceId },
    });
    if (roleSlugExists && roleSlugExists.id.toString() !== id.toString())
      throw new Error(`Role: ${input.label} already exist!`);
    input.slug = roleSulg;
    const update = await this.repository.updateOne({ id, input });
    if (update[0] === 0) throw new Error(`Role: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }

  async deleteOne(id: number): Promise<boolean> {
    const roleExists = await this.repository.findByPk(id);
    if (!roleExists) throw new Error(`Role: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Role: ${id} does not exist!`);
    return true;
  }
  async findOne(name: string): Promise<RoleInterface> {
    let where: WhereOptions<any> = {};
    if (name) {
      let slugExist = slug(name);
      where = { ...where, slug: slugExist };
    }
    const roleExist = this.repository.findOne({ where: where });
    if (!roleExist) throw new Error(`Role ${name} does not exist`);
    return roleExist;
  }
}
