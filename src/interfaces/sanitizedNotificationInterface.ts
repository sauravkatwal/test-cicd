import * as Sequelize from 'sequelize';
import { ModelTimestampExtend, PaginationOrderSearchExtend } from '.';
export interface Progress {
  deliverable: number;
  total: number;
  completed: number;
  risky: number;
}
export interface InputSanitizedNotificationInterface {
  workspaceId: Sequelize.CreationOptional<number>;
  logs: Object[];
}

export interface SanitizedNotificationInterface extends ModelTimestampExtend, InputSanitizedNotificationInterface {
  id: Sequelize.CreationOptional<number>;
}

export interface SanitizedNotificationModelInterface
  extends Sequelize.Model<SanitizedNotificationInterface, Partial<InputSanitizedNotificationInterface>>,
  SanitizedNotificationInterface { }

export interface ArgsSanitizedNotificationInterface extends PaginationOrderSearchExtend {
  workspaceId?: Sequelize.CreationOptional<number>;
}

