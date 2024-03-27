import { ScreenStatusEnum } from '../enums';
import * as Sequelize from 'sequelize';

import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, ModuleInterface, PaginationOrderSearchExtend } from '.';

export interface InputScreenInterface {
  name: string;
  slug: string;
  isDefault: boolean;
  status: ScreenStatusEnum;
  description: string;
}

export interface ScreenInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  slug: string;
  isDefault: boolean;
  status: ScreenStatusEnum;
  description: string;
  modules?: ModuleInterface[];
}

export interface ScreenModelInterface
  extends Sequelize.Model<ScreenInterface, Partial<InputScreenInterface>>,
  ScreenInterface {}

export interface ArgsScreensInterface extends CursorPaginationOrderSearchExtend {
  name?: string;
  slug?: string;
}

