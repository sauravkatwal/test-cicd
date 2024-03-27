import * as Sequelize from 'sequelize';
import { RoleInterface } from '../interfaces';
import { ModelTimestampExtend } from './modelExtendInterface';

export interface InputUserWorkspaceRoleInterface {
  user_workspace_id?: Sequelize.CreationOptional<number>;
  role_id?: Sequelize.CreationOptional<number>;
  role?: string;
}

export interface UserWorkspaceRoleInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  user_workspace_id: Sequelize.CreationOptional<number>;
  role_id: Sequelize.CreationOptional<number>;
  role?: RoleInterface;
}

export interface UserWorkspaceRoleModelInterface
  extends Sequelize.Model<UserWorkspaceRoleInterface, Partial<InputUserWorkspaceRoleInterface>>,
    UserWorkspaceRoleInterface {}

