import * as Sequelize from 'sequelize';

import { InputUserWorkspaceInterface, ModelTimestampExtend,UserWorkspaceRoleInterface, UserInterface, InBetweenDateExtend, CursorPaginationOrderSearchExtend, CompanyInterface, TransactionInterface} from './';
import { ServiceEnum } from '../enums';

export interface InputWorkspaceInterface {
  label: string;
  secret?: string;
  owner_id: Sequelize.CreationOptional<number>;
  workspace_users?: InputUserWorkspaceInterface[];
  user?: UserInterface;
  userWorkspaceRoles?: UserWorkspaceRoleInterface[];
  dbDatabase?: string;
  dbUsername?: string;
  dbPassword?: string;
  dbHost?: string;
  dbPort?: number;
  dbDialect?: string;
  dbDialectOptions?: any;
  dbLogging?: boolean;

}
export interface WorkspaceInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  label: string;
  secret: string;
  owner_id: Sequelize.CreationOptional<number>;
  user?: UserInterface;
  userWorkspaceRoles?: UserWorkspaceRoleInterface[];
  dbDatabase: string;
  dbUsername: string;
  dbPassword: string;
  dbHost: string;
  dbPort: number;
  dbDialect: string;
  dbDialectOptions: any;
  dbLogging: boolean;
  user_roles?: UserWorkspaceRoleInterface[];
  company?: CompanyInterface;
  services: Services[];
}

interface Services {
  service: ServiceEnum; 
  availableBalance: number;
  serviceRate: number;
}

export interface WorkspaceArgsExtend extends InBetweenDateExtend {
  workspace_id?: number;
  workspaceId?: number;
}

export interface WorkspaceVerificationInterface {
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  companyRegNo?: string;
}

export interface ArgsWorkspaceInterface extends CursorPaginationOrderSearchExtend, WorkspaceArgsExtend {
  service?: ServiceEnum
 }
