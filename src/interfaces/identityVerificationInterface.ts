import * as Sequelize from 'sequelize';
import { ModelTimestampExtend } from '.';

export interface InputIdentityVerificationInterface {
    identity: string;
    token: string;
    expiryDate?: Date;
    meta: any;
}

export interface IdentityVerificationInterface extends ModelTimestampExtend  {
    id: Sequelize.CreationOptional<number>;
    identity: string;
    token: string;
    expiryDate?: Date;
    meta: any;
}

  export interface IdentityVerificationModelInterface
    extends Sequelize.Model<
    IdentityVerificationInterface,
        Partial<InputIdentityVerificationInterface>
      >,
      IdentityVerificationInterface {}



