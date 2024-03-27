import * as Sequelize from 'sequelize';
import { ModelTimestampExtend, PaginationOrderSearchExtend, WorkspaceArgsExtend } from '.';

export interface InputEmailRegistryEmailRegistryGroupInterface {
  emailRegistryId?: Sequelize.CreationOptional<number>;
  emailRegistryGroupId?: Sequelize.CreationOptional<number>;
}

export interface EmailRegistryEmailRegistryGroupInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  emailRegistryId: Sequelize.CreationOptional<number>;
  emailRegistryGroupId: Sequelize.CreationOptional<number>;
}

export interface ArgsEmailRegistryEmailRegistryGroupInterface
  extends PaginationOrderSearchExtend,
    WorkspaceArgsExtend {}

export interface EmailRegistryEmailRegistryGroupModelInterface
  extends Sequelize.Model<
      EmailRegistryEmailRegistryGroupInterface,
      Partial<InputEmailRegistryEmailRegistryGroupInterface>
    >,
    EmailRegistryEmailRegistryGroupInterface {}
