import { WorkspaceResourcePurposeEnum } from "enums";
import { InputImportEmailRegistryInterface } from "./emailRegistryInterface";
import { AwsSqsCredentials } from "./workspaceResourceInterface";

export interface InputCBSEmailRegistryInterface extends Partial<InputImportEmailRegistryInterface> {
  sanitize: boolean;
  userId: number;
}

export interface InputAWSSQSInterface {
  workspaceSecret: string;
  purpose: WorkspaceResourcePurposeEnum, 
  credentials: AwsSqsCredentials
}