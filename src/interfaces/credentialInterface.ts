import * as Sequelize from 'sequelize';
import { AWSSecretInterface, SparrowSmsSecretInterface, SparrowViberSecretInterface, ModelTimestampExtend } from '.';

export interface CombinedSecretTypeInterface extends AWSSecretInterface, SparrowSmsSecretInterface, SparrowViberSecretInterface {};

export interface InputCredentialInterface {
  secret: AWSSecretInterface | SparrowSmsSecretInterface | SparrowViberSecretInterface;
  messagingPlatformId: number;
  workspaceId: number;
  isActive: boolean;
}

export interface CredentialInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  secret: CombinedSecretTypeInterface;
  workspaceId: Sequelize.CreationOptional<number>;
  messagingPlatformId?: number;
  isActive: boolean;
}

export interface CredentialModelInterface
  extends Sequelize.Model<CredentialInterface, Partial<InputCredentialInterface>>,
    CredentialInterface {}
