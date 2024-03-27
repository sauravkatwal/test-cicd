import * as Sequelize from 'sequelize';
import { InputEmailRegistryEmailRegistryGroupInterface, ModelTimestampExtend, WorkspaceArgsExtend } from '.';
import {
  EmailRegistryGroupTypesEnum,
  EmailRegistrySanitizedReasonEnum,
  EmailRegistrySanitizedStatusEnum,
  EmailRegistryStatusEnum,
} from '../enums';
import { CursorPaginationOrderSearchExtend, WorkspaceExtend } from '../interfaces';

export interface InputEmailRegistryInterface extends WorkspaceExtend {
  name: string;
  email: string;
  phoneNumber?: string;
  description?: string;
  emailVerified?: boolean;
  phoneNumberVerified?: boolean;
  status?: EmailRegistryStatusEnum;
  sanitizedStatus?: EmailRegistrySanitizedStatusEnum;
  sanitizedReason?: EmailRegistrySanitizedReasonEnum;
  sanitizedResponse?: object;
  genderId?: number;
  dob?: string;
  nationalityId?: number;
  provinceId?: number;
  districtId?: number;
  municipality?: string;
  ward?: number;
  profession?: string;
  sanitizedDate?: Date;
  emailRegistryGroupIds?: number[];
  emailRegistryGroupId?: number;
  emailRegistryEmailRegistryGroups?: InputEmailRegistryEmailRegistryGroupInterface[];
}

export interface InputImportEmailRegistryInterface extends InputEmailRegistryInterface {
  gender?: string;
  nationality?: string;
  province?: string;
  district?: string;
  groupLabel?: string;
}

export interface EmailRegistryInterface extends InputEmailRegistryInterface, ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
}

export interface EmailRegistriesCountInterface {
  status?: EmailRegistryStatusEnum;
  sanitizedStatus?: EmailRegistrySanitizedStatusEnum;
}

export interface ArgsEmailRegistryInterface extends CursorPaginationOrderSearchExtend, WorkspaceArgsExtend {
  status?: EmailRegistryStatusEnum;
  type?: EmailRegistryGroupTypesEnum;
  emailRegistryGroupId?: number;
  sanitizedStatus?: EmailRegistrySanitizedStatusEnum;
}

export interface InputEmailRegistriesWithEmailRegistryGroupId {
  emailRegistryGroupId: number;
  emailRegistryIds?: number[];
  emailRegistries?: InputEmailRegistryInterface[];
  sanitize?: boolean;
}

export interface EmailRegistryModelInterface
  extends Sequelize.Model<EmailRegistryInterface, Partial<InputEmailRegistryInterface>>,
    EmailRegistryInterface {}
