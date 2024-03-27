import { APIGatewayEvent } from 'aws-lambda';

import {
  ModelsInterface,
  UserInterface,
  WorkspaceInterface,
} from ".";

export interface ContextInterface {
  user?: UserInterface;
  workspace?: WorkspaceInterface;
  token?: string;
  models?: ModelsInterface;
}

export interface CustomAPIGatewayEvent extends APIGatewayEvent {
  workspaceId?: number;
  userId?: number;
  models?: ModelsInterface
}
