import * as Sequelize from 'sequelize';
import { UserRoleInterface, InputCompanyInterface, InputPointOfContactInterface, InputTransactionInterface, ModelTimestampExtend, PaginationOrderSearchExtend, TransactionInterface, WorkspaceArgsExtend, WorkspaceInterface } from '.';
import { RoleEnum, ServiceEnum, UserWorkspaceStatusEnum } from '../enums';

export interface InputUserInterface {
  sub?: string;
  name?: string;
  username?: string;
  email?: string;
  email_verified?: boolean;
  phone_number?: string;
  phone_number_verified?: boolean;
  role?: string;
  roles?: string[];
  password?: string;
  confirmation_status?: boolean;
  account_status?: boolean;
  status?: UserWorkspaceStatusEnum;
  current_workspace_id?: number;
  companyInfo?: InputCompanyInterface;
  pointOfContact?: InputPointOfContactInterface;
  services?: InputTransactionInterface[];
}

export interface UserInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  sub: string;
  name: string;
  username: string;
  email: string;
  email_verified: boolean;
  phone_number: string;
  phone_number_verified: boolean;
  roles: string[];
  workspaces: WorkspaceInterface[];
  confirmation_status: boolean;
  account_status: boolean;
  status: UserWorkspaceStatusEnum;
  current_workspace_id?: number;
  current_workspace: WorkspaceInterface;
  user_workspaces: WorkspaceInterface[];
  userRole?: UserRoleInterface;
}

export interface ArgsWorkspaceMembersInterface extends PaginationOrderSearchExtend, WorkspaceArgsExtend {
  status?: UserWorkspaceStatusEnum;
  service?: ServiceEnum;
}
