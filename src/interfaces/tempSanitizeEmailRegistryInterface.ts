import * as Sequelize from 'sequelize';
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, PaginationOrderSearchExtend, WorkspaceArgsExtend } from '.';
import { EmailRegistryStatusEnum, EmailRegistrySanitizedStatusEnum, EmailRegistrySanitizedReasonEnum } from '../enums';

export interface InputTempSanitizeEmailRegistryInterface {
  email: string;
  sanitizedStatus: EmailRegistrySanitizedStatusEnum;
  sanitizedReason: EmailRegistrySanitizedReasonEnum;
  sanitizedResponse: object;
  workspaceId: Sequelize.CreationOptional<number>;
}

export interface TempSanitizeEmailRegistryInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  email: string;
  sanitizedStatus: EmailRegistrySanitizedStatusEnum;
  sanitizedReason: EmailRegistrySanitizedReasonEnum;
  sanitizedResponse: object;
  workspaceId: Sequelize.CreationOptional<number>;
}

export interface ArgsTempSanitizeEmailRegistryInterface
  extends CursorPaginationOrderSearchExtend,
    WorkspaceArgsExtend {}

export interface TempSanitizeEmailRegistryModelInterface
  extends Sequelize.Model<
  TempSanitizeEmailRegistryInterface,
      Partial<InputTempSanitizeEmailRegistryInterface>
    >,
    TempSanitizeEmailRegistryInterface {}
