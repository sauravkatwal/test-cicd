import * as Sequelize from 'sequelize';
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, ModuleInterface, PaginationOrderSearchExtend } from '../interfaces';

export interface InputPrivilegeInterface {
  name: string;
  slug: string;
  moduleId: number;
  isDefault: boolean;
  description?: string;
}

export interface PrivilegeInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  slug: string;
  moduleId: number;
  isDefault: boolean;
  module?: ModuleInterface;
  description?: string;
}

export interface PrivilegeModelInterface
  extends Sequelize.Model<PrivilegeInterface, Partial<InputPrivilegeInterface>>,
  PrivilegeInterface {}

export interface ArgsPrivilegesInterface extends CursorPaginationOrderSearchExtend { }
