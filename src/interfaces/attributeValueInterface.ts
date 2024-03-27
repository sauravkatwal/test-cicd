import * as Sequelize from 'sequelize';

import { ModelTimestampExtend, PaginationOrderSearchExtend } from '.';

export interface InputAttributeValueInterface {
  value: string;
  description: string;
  isActive: boolean;
  isDefault: boolean;
  attributeId: Sequelize.CreationOptional<number>;
  slug?: string;
}

export interface AttributeValueInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  value: string;
  description: string;
  isActive: boolean;
  isDefault: boolean;
  attributeId: Sequelize.CreationOptional<number>;
  slug: string;
}

export interface ArgsAttributeValuesInterface extends PaginationOrderSearchExtend {
  attributeId?: Sequelize.CreationOptional<number>;
  attributeName?: string;
}

export interface AttributeValueModelInterface
  extends Sequelize.Model<AttributeValueInterface, Partial<InputAttributeValueInterface>>,
  AttributeValueInterface {}
