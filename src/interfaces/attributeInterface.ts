import * as Sequelize from 'sequelize';

import {
  AttributeValueInterface,
  ModelTimestampExtend,
  PaginationOrderSearchExtend
} from '.';

export interface InputAttributeInterface {
  name: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
}

export interface AttributeInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
  attributeValues?: AttributeValueInterface[]
}

export interface ArgsAttributesInterface extends PaginationOrderSearchExtend { }
