import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from ".";
import {
  WorkspaceResourcePurposeEnum,
  WorkspaceResourceTypeEnum
} from "../enums";


export interface AwsSqsCredentials {
  region: string;
  queueUrl: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface InputWorkspaceResourceInterface {
  workspaceId: Sequelize.CreationOptional<number>;
  credentials: AwsSqsCredentials; // concat other if required
  type: WorkspaceResourceTypeEnum;
  purpose: WorkspaceResourcePurposeEnum;
  isActive: boolean;
}

export interface WorkspaceResourceInterface extends InputWorkspaceResourceInterface, ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
}

export interface WorkspaceResourceModelInterface
  extends Sequelize.Model<WorkspaceResourceInterface, Partial<InputWorkspaceResourceInterface>>,
  WorkspaceResourceInterface { }
