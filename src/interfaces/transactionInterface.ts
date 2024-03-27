import * as Sequelize from 'sequelize';
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, ServiceInterface, UserInterface, WorkspaceArgsExtend } from '.';
import { ServiceEnum } from '../enums';

export interface InputTransactionInterface {
  transactionCode: string;
  workspaceId: number;
  credit?: number;
  debit?: number;
  serviceId?: number;
  service?: ServiceEnum;
  transactionDate: Date;
  transactionById: number;
  campaignScheduleId?: number;
  emailRegistryIds?: number[];
  serviceRate?: number
}

export interface TransactionInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  transactionCode: string;
  workspaceId: number;
  credit?: number;
  debit?: number;
  serviceId: number;
  transactionDate: Date;
  transactionById: number;
  transactionBy?: UserInterface;
  campaignScheduleId?: number;
  service?: ServiceInterface;
  availableBalance?: number;
}

export interface ArgsTransactionInterface extends CursorPaginationOrderSearchExtend, WorkspaceArgsExtend {
  service?: ServiceEnum
}

export interface TransactionModelInterface
  extends Sequelize.Model<TransactionInterface, Partial<InputTransactionInterface>>,
    TransactionInterface {}
