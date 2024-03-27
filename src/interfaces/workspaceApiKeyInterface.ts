import * as Sequelize from 'sequelize';

import { ModelTimestampExtend, CursorPaginationOrderSearchExtend, WorkspaceArgsExtend } from './';
import { SortEnum } from '../enums';

export interface InputWorkspaceApiKeyInterface {
  apiKey?: string;
  workspaceId?: number;
  enable?: boolean;
}
export interface WorkspaceApiKeyInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  workspaceId?: Sequelize.CreationOptional<number>;
  apiKey?: string;
  enable?: boolean;
}

export interface WorkspaceApiKeyModelInterface
  extends Sequelize.Model<
    WorkspaceApiKeyInterface,
    Partial<InputWorkspaceApiKeyInterface>
  >,
  WorkspaceApiKeyInterface { }

export interface ArgsWorkspaceApiKeyInterface extends CursorPaginationOrderSearchExtend, WorkspaceArgsExtend {
  enable?: boolean;
}
