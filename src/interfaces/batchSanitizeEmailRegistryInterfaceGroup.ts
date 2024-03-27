import * as Sequelize from 'sequelize';
import {
  CursorPaginationOrderSearchExtend,
  EmailRegistryInterface,
  ModelTimestampExtend,
  WorkspaceArgsExtend,
} from '.';

export interface InputBatchSanitizeEmailRegistryGroupInterface {
  emailRegistryGroupId?: number;
  batchRequestId: string;
  workspaceId: number;
  log: Object;
  emailRegistries?: EmailRegistryInterface[];
  status: string;
}

export interface BatchSanitizeEmailRegistryGroupInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  emailRegistryGroupId?: number;
  batchRequestId: string;
  workspaceId: number;
  log: Object;
  status: string;
}

export interface nputBatchSanitizeEmailRegistryGroupInterface
  extends CursorPaginationOrderSearchExtend,
    WorkspaceArgsExtend {}

export interface BatchSanitizeEmailRegistryGroupModelInterface
  extends Sequelize.Model<
      BatchSanitizeEmailRegistryGroupInterface,
      Partial<InputBatchSanitizeEmailRegistryGroupInterface>
    >,
    BatchSanitizeEmailRegistryGroupInterface {}
