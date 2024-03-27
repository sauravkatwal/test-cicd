import * as Sequelize from 'sequelize';

import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, ScreenRoleMappingInterface, UserWorkspaceRoleInterface, WorkspaceExtend } from '../interfaces';

export interface InputRoleInterface
extends WorkspaceExtend {
  label: string;
  slug: string;
  level: number;
  isDefault: boolean;
  isActive: boolean;
  position: number;
  userWorkspaceRoles?: Partial<UserWorkspaceRoleInterface>[];
}

export interface RoleInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  label: string;
  slug: string;
  level: number;
  isDefault: boolean;
  isActive: boolean;
  position: number;
  workspaceId: number;
  roleMaps?: ScreenRoleMappingInterface[];
}

export interface RoleModelInterface
  extends Sequelize.Model<RoleInterface, Partial<InputRoleInterface>>,
  RoleInterface {}

export interface ArgsRolesInterface extends CursorPaginationOrderSearchExtend {
  label?: string;
  slug?: string;
  workspace_id?: number;
}