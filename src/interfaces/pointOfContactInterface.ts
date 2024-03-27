import * as Sequelize from 'sequelize';
import {WorkspaceExtend, ModelTimestampExtend } from '.';

export interface InputPointOfContactInterface {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  jobPosition: string;
  workspaceId: number;
}

export interface PointOfContact extends ModelTimestampExtend, WorkspaceExtend {
    id: Sequelize.CreationOptional<number>;
    workspaceId: Sequelize.CreationOptional<number>;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    jobTitle: string;
    jobPosition: string;
}

  export interface PointOfContactModelInterface
    extends Sequelize.Model<
        PointOfContact,
        Partial<InputPointOfContactInterface>
      >,
      PointOfContact {}



