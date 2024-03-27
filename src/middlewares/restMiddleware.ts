import { MiddlewareObject, HandlerLambda } from 'middy';
import { APIGatewayProxyResult } from 'aws-lambda';

import { WorkspaceApiKeyService, WorkspaceService } from '../services';
import { Tenant } from './tenantConnectionManager';
import { CustomAPIGatewayEvent } from '../interfaces';

export const restAPIMiddleware = (): MiddlewareObject<CustomAPIGatewayEvent, APIGatewayProxyResult> => {
  const before = async (
    handler: HandlerLambda<CustomAPIGatewayEvent, APIGatewayProxyResult>,
  ): Promise<APIGatewayProxyResult | void> => {
    try {
      const workspaceApiKey = handler.event.headers['workspace-api-key'];
      if (!workspaceApiKey) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Please provide a workspace api key!!',
          }),
        };
      }
      const apiKeyExist = await new WorkspaceApiKeyService().findOne({ apiKey: workspaceApiKey });
      if (!apiKeyExist) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Workspace API key not found. Please provide a valid API key.',
          }),
        };
      }
      const workspace = await new WorkspaceService().findByPk(apiKeyExist.workspaceId!);
      const models = await Tenant.connectTenantDB(workspace);
      handler.event.models = models;
      handler.event.workspaceId = workspace.id;
      handler.event.userId = workspace.owner_id;
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error', error }),
      };
    }
  };
  return {
    before,
  };
};
