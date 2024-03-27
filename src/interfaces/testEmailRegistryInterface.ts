import * as Sequelize from 'sequelize';
import { InputEmailRegistryEmailRegistryGroupInterface, ModelTimestampExtend, WorkspaceArgsExtend } from '.';
import { EmailRegistryGroupTypesEnum, EmailRegistrySanitizedReasonEnum, EmailRegistrySanitizedStatusEnum, EmailRegistryStatusEnum } from '../enums';
import { CursorPaginationOrderSearchExtend, WorkspaceExtend } from '../interfaces';

export interface InputTestEmailRegistryInterface extends WorkspaceExtend {
  name?: string;
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  description?: string;
  emailRegistryGroupIds?: number[];
  emailRegistryGroupId?: number;
  emailRegistryEmailRegistryGroups?: InputEmailRegistryEmailRegistryGroupInterface[];
  status?: EmailRegistryStatusEnum;
  sanitizedStatus?: EmailRegistrySanitizedStatusEnum | null;
  sanitizedReason?: EmailRegistrySanitizedReasonEnum | null;
  sanitizedResponse?: object | null;

}

export interface TestEmailRegistryInterface extends ModelTimestampExtend, WorkspaceExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  description: string;
  status: EmailRegistryStatusEnum;
  sanitizedStatus: EmailRegistrySanitizedStatusEnum;
  sanitizedReason: EmailRegistrySanitizedReasonEnum;
  sanitizedResponse: object;
}

export interface TestEmailRegistriesCountInterface {
  status?: EmailRegistryStatusEnum;
  sanitizedStatus?: EmailRegistrySanitizedStatusEnum;
}

export interface ArgsTestEmailRegistryInterface extends CursorPaginationOrderSearchExtend, WorkspaceArgsExtend {
  status?: EmailRegistryStatusEnum;
  type?: EmailRegistryGroupTypesEnum;
  emailRegistryGroupId?: number;
  sanitizedStatus?: EmailRegistrySanitizedStatusEnum;
}

export interface InputTestEmailRegistriesWithEmailRegistryGroupId {
  emailRegistryGroupId: number;
  emailRegistryIds?: number[];
  emailRegistries?: InputTestEmailRegistryInterface[];
  sanitize?: boolean;
}

export interface TestEmailRegistryModelInterface
  extends Sequelize.Model<TestEmailRegistryInterface, Partial<InputTestEmailRegistryInterface>>,
  TestEmailRegistryInterface {}
