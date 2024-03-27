import * as Sequelize from 'sequelize';
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, WorkspaceArgsExtend } from '.';
import { ServiceEnum } from '../enums';

export interface InputTransactionLogInterface {
  workspaceId: number;
  amount: number;
  serviceId?: number;
  transactionById: number;
  campaignScheduleId?: number;
  releaseBalance?: boolean;
  sanitizedEmailRegistryIds?: number[];
  service?: ServiceEnum;
  batchSanitizeEmailRegistryGroupId?: number;
}

export interface TransactionLogInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  workspaceId: number;
  amount: number;
  serviceId: number;
  transactionById: number;
  campaignScheduleId?: number;
  releaseBalance: boolean;
  sanitizedEmailRegistryIds?: number[];
  availableBalance?: number;
  batchSanitizeEmailRegistryGroupId?: number
}

export interface ArgsTransactionLogInterface extends CursorPaginationOrderSearchExtend, WorkspaceArgsExtend {}

export interface TransactionLogModelInterface
  extends Sequelize.Model<TransactionLogInterface, Partial<InputTransactionLogInterface>>,
    TransactionLogInterface {}
