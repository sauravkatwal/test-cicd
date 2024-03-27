import * as Sequelize from "sequelize";
import { RoleEnum, UserWorkspaceStatusEnum } from "../enums";

import { InputUserWorkspaceRoleInterface, ModelTimestampExtend, UserInterface } from ".";

export interface InputUserWorkspaceInterface {
  user_id: Sequelize.CreationOptional<number>;
  workspace_id?: Sequelize.CreationOptional<number>;
  user_roles?: InputUserWorkspaceRoleInterface[];
  role?: string;
  status?: UserWorkspaceStatusEnum;
}

export interface UserWorkspaceInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  user_id: Sequelize.CreationOptional<number>;
  workspace_id: Sequelize.CreationOptional<number>;
  status: UserWorkspaceStatusEnum;
  user: UserInterface
}
