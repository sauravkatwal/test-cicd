import { PrivilegeEnum } from 'enums';
import * as Sequelize from 'sequelize';

import {
  CursorPaginationOrderSearchExtend,
  ModelTimestampExtend,
  ModuleInterface,
  PaginationOrderSearchExtend,
  PrivilegeInterface,
  RoleInterface,
  ScreenInterface,
} from '.';

export interface InputScreenRoleMappingSlugInterface {
  screenSlug: string;
  moduleSlug: string;
  privilegeSlug: string;
}

export interface InputScreenRoleMappingInterface {
  roleId: number;
  isDefault: boolean;
  isPublished: boolean;
  isActive: boolean;
  screenId?: number;
  moduleId?: number;
  privilegeId?: number;
}

export interface ScreenRoleMappingInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  roleId: Sequelize.CreationOptional<number>;
  isDefault: boolean;
  isPublished: boolean;
  isActive: boolean;
  screen?: ScreenInterface[] | ScreenInterface;
  module?: ModuleInterface[] | ModuleInterface;
  privilege?: PrivilegeInterface[] | PrivilegeInterface;
  role?: RoleInterface[];
  moduleId?: number;
  screenId?: number;
  privilegeId?: number;
}

export interface ArgsScreenRoleMappingInterface extends CursorPaginationOrderSearchExtend {
  roleId?: Sequelize.CreationOptional<number>;
  isDefault?: boolean;
  isPublished?: boolean;
  isActive?: boolean;
  screen?: ScreenInterface[];
  module?: ModuleInterface[];
  privilege?: PrivilegeInterface[];
  role?: RoleInterface[];
  moduleId?: number;
  screenId?: number;
  privilegeId?: number;
}

export interface ScreenRoleMappingModelInterface
  extends Sequelize.Model<ScreenRoleMappingInterface, Partial<InputScreenRoleMappingInterface>>,
  ScreenRoleMappingInterface {}
