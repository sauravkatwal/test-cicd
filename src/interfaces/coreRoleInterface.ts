import * as Sequelize from 'sequelize';

import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from '.';

export interface InputCoreRoleInterface {
  label: string;
  slug: string;
  level: number;
  isDefault: boolean;
  isActive: boolean;
  position: number;
}

export interface CoreRoleInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  label: string;
  slug: string;
  level: number;
  isDefault: boolean;
  isActive: boolean;
  position: number;
}

export interface CoreRoleModelInterface
  extends Sequelize.Model<CoreRoleInterface, Partial<InputCoreRoleInterface>>,
    CoreRoleInterface {}

export interface ArgsCoreRolesInterface extends CursorPaginationOrderSearchExtend {}
