import * as Sequelize from 'sequelize';
import { UserWorkspaceInterface, WorkspaceInterface, UserInterface } from '.';

export interface ModelTimestampExtend {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ModelCreatorIdExtend {
  created_by_id?: Sequelize.CreationOptional<number>;
  updated_by_id?: Sequelize.CreationOptional<number>;
}

export interface ModelCreatorIncludeExtend extends ModelCreatorIdExtend {
  created_by?: UserInterface;
  updated_by?: UserWorkspaceInterface;
}

export interface WorkspaceExtend {
  workspaceId: Sequelize.CreationOptional<number>;
}

export interface WorkspaceIncludeExtend extends WorkspaceExtend {
  workspace?: WorkspaceInterface;
}
