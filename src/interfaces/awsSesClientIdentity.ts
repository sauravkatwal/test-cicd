import * as Sequelize from 'sequelize';
import { AwsSesStatus, IdentityType } from '../enums';

import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, PaginationOrderSearchExtend, WorkspaceArgsExtend } from '.';

export interface InputAWSSesClientIdentityInterface {
  identity: string;
  type?: IdentityType;
  workspaceId: number;
  status?: AwsSesStatus;
}

export interface AWSSesClientIdentitiyInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  type: IdentityType;
  identity: string;
  workspaceId: Sequelize.CreationOptional<number>;
  status: AwsSesStatus;
}

export interface ArgsAWSSesClientIdentitiyInterface extends CursorPaginationOrderSearchExtend, WorkspaceArgsExtend {
  status?: AwsSesStatus;
  identity?: string;
  updateBeforeFetch?: boolean;
}

export interface AwsSesClientIdentityModelInterface
  extends Sequelize.Model<AWSSesClientIdentitiyInterface, Partial<InputAWSSesClientIdentityInterface>>,
    AWSSesClientIdentitiyInterface {}

