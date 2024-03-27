import * as Sequelize from 'sequelize';

import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, PrivilegeInterface, ScreenInterface } from '.';

export interface InputModuleInterface {
  name: string;
  slug: string;
  isDefault: boolean;
  screenId: number;
}

export interface ModuleInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  slug: string;
  isDefault: boolean;
  screenId: number;
  screen?: ScreenInterface;
  privileges?: PrivilegeInterface[];
}

export interface ModuleModelInterface
  extends Sequelize.Model<ModuleInterface, Partial<InputModuleInterface>>,
  ModuleInterface {}
  
export interface ArgsModulesInterface extends CursorPaginationOrderSearchExtend {
  name?: string;
  slug?: string;
  isDefault?: boolean;
}
