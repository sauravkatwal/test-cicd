import * as Sequelize from 'sequelize';

import { AddressInterface, InputAddressInterface, ModelTimestampExtend } from '.';

export interface InputCompanyInterface {
  name: string;
  workspace_id: number;
  registration_number: string;
  user_id: Sequelize.CreationOptional<number>;
  address: InputAddressInterface;
}

export interface CompanyInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  workspace_id: number;
  registration_number: string;
  user_id: Sequelize.CreationOptional<number>;
  address: AddressInterface;
}
