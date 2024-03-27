import * as Sequelize from "sequelize";

import { ModelTimestampExtend, RoleInterface } from ".";

export interface InputUserRoleInterface {
  roleId: number;
  userId: number;
}

export interface UserRoleInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  roleId: number;
  userId: number;
  role?: Partial<RoleInterface>;
}

export interface UserRoleModelInterface
  extends Sequelize.Model<UserRoleInterface, Partial<InputUserRoleInterface>>,
  UserRoleInterface {}
