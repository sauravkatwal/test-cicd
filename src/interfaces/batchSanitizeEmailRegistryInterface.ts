import * as Sequelize from 'sequelize';
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, WorkspaceArgsExtend } from '.';

export interface InputBatchSanitizeEmailRegistryInterface {
  batchSanitizeEmailRegistryGroupId: number;
  emailRegistryId: number;
  workspaceId: number;
}

export interface BatchSanitizeEmailRegistryInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  batchSanitizeEmailRegistryGroupId: number;
  emailRegistryId: number;
  workspaceId: number;
}

export interface ArgsInputBatchSanitizeEmailRegistryInterface
  extends CursorPaginationOrderSearchExtend,
    WorkspaceArgsExtend {}

export interface BatchSanitizeEmailRegistryModelInterface
  extends Sequelize.Model<
  BatchSanitizeEmailRegistryInterface,
      Partial<InputBatchSanitizeEmailRegistryInterface>
    >,
    BatchSanitizeEmailRegistryInterface {}
