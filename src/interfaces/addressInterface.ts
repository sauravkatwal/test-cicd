import * as Sequelize from "sequelize";

import { ModelTimestampExtend } from ".";

export interface InputAddressInterface {
  street: string;
  suburb: string;
  state: string;
  country: string;
  company_id?: Sequelize.CreationOptional<number>;
  postalCode: string;
}

export interface AddressInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  street: string;
  suburb: string;
  state: string;
  country: string;
  company_id: Sequelize.CreationOptional<number>;
  postalCode: string;
}