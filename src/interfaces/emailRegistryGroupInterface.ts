import * as Sequelize from 'sequelize';
import {
  EmailRegistryInterface,
  InputEmailRegistryEmailRegistryGroupInterface,
  InputEmailRegistryInterface,
  ModelTimestampExtend,
  PaginationOrderSearchExtend,
  WorkspaceArgsExtend,
} from '.';
import { EmailRegistryGroupStatusEnum, EmailRegistryGroupTypesEnum } from '../enums';

export interface InputAge {
  from: number;
  to: number;
}

export interface InputFilterCriteria {
  age?: InputAge;
  gender?: string;
  province?: string;
  district?: string;
  nationality?: string;
}

export interface InputEmailRegistryGroupInterface {
  label: string;
  slug?: string;
  workspaceId: Sequelize.CreationOptional<number>;
  status: EmailRegistryGroupStatusEnum;
  type:EmailRegistryGroupTypesEnum;
  sanitize?: boolean;
  emailRegistries?: number[];
  emailRegistryGroupEmailRegistries?: InputEmailRegistryEmailRegistryGroupInterface[];
  filterCriteria?: InputFilterCriteria;
  isExistingCriteria?: boolean;
  csvData?: InputEmailRegistryInterface[];
  description?: string;
  groupCode?: string;
}

export interface InputEmailGroupRegistryWithEmailRegistriesInterface {
  label: string;
  workspaceId: Sequelize.CreationOptional<number>;
  status: EmailRegistryGroupStatusEnum;
  type:EmailRegistryGroupTypesEnum;
  sanitize: boolean;
  emailRegistries: InputEmailRegistryInterface[];
}

export interface InputEmailGroupRegistryWithExistingEmailRegistriesInterface {
  label: string;
  workspaceId: Sequelize.CreationOptional<number>;
  status: EmailRegistryGroupStatusEnum;
  type:EmailRegistryGroupTypesEnum;
  sanitize: boolean;
  emailRegistries: number[];
}

export interface EmailRegistryGroupInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  label: string;
  slug: string;
  workspaceId: Sequelize.CreationOptional<number>;
  status: EmailRegistryGroupStatusEnum;
  type:EmailRegistryGroupTypesEnum;
  emailRegistries?: EmailRegistryInterface[];
  filterCriteria: Record<string, unknown>;
  summary?: Record<string, string>[];
  emailRegistryCount?: number;
  isExistingCriteria: boolean;
  description: string;
  groupCode: string;
}

export interface ArgsEmailRegistryGroupInterface extends PaginationOrderSearchExtend, WorkspaceArgsExtend {}

export interface EmailRegistryGroupModelInterface
  extends Sequelize.Model<EmailRegistryGroupInterface, Partial<InputEmailRegistryGroupInterface>>,
    EmailRegistryGroupInterface {}
