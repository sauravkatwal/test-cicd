import * as Sequelize from 'sequelize';
import { ModelTimestampExtend, PaginationOrderSearchExtend, WorkspaceArgsExtend } from '.';

export interface InputTransactionEmailRegistryInterface {
  emailRegistryId?: Sequelize.CreationOptional<number>;
  transactionId?: Sequelize.CreationOptional<number>;
}

export interface TransactionEmailRegistryInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  emailRegistryId: Sequelize.CreationOptional<number>;
  transactionId: Sequelize.CreationOptional<number>;
}

export interface ArgsTransactionEmailRegistryInterface
  extends PaginationOrderSearchExtend,
    WorkspaceArgsExtend {}

export interface TransactionEmailRegistryModelInterface
  extends Sequelize.Model<
      TransactionEmailRegistryInterface,
      Partial<InputTransactionEmailRegistryInterface>
    >,
    TransactionEmailRegistryInterface {}
