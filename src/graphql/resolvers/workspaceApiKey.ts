import { InformationEvent } from 'http';
import { CursorPagination, SuccessResponse } from '../../helpers';
import { ContextInterface, InputWorkspaceApiKeyInterface, ArgsWorkspaceApiKeyInterface } from '../../interfaces';
import { WorkspaceApiKeyService } from '../../services';
import { Guard } from '../../middlewares';
import { Ksuid } from '../../helpers/ksuidHelper'

export const workspaceApiKeyResolvers = {
  Mutation: {
    createWorkspaceApiKey: async (
      parent: ParentNode,
      args: { input: InputWorkspaceApiKeyInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      args.input.workspaceId = workspace.id;
      args.input.apiKey = `test_api_${Ksuid.randomSync()}`;
      
      await new WorkspaceApiKeyService().create(args.input);
      return SuccessResponse.send({
        message: 'Workspace Api Key successfully created.'
      });
    },
    updateWorkspaceApiKey: async (
      parent: ParentNode,
      args: { id: number; input: InputWorkspaceApiKeyInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const updatedWorkspaceApiKey = await new WorkspaceApiKeyService().updateOne(
        args.id,
        args.input
      );
      return SuccessResponse.send({
        message: 'Workspace Api Key successfully updated.',
        data: updatedWorkspaceApiKey,
      });
    },
    deleteWorkspaceApiKey: async (
      parent: ParentNode,
      args: { id: number; },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      await new WorkspaceApiKeyService().deleteOne(args.id);

      return SuccessResponse.send({
        message: 'Workspace deleted successfully',
      });
    }

  },
  Query: {
    workspaceApiKeys: async (
      parent: ParentNode,
      args: ArgsWorkspaceApiKeyInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { enable } = args;
      const { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });

      const { cursorCount, count, rows } = await new WorkspaceApiKeyService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
        enable,
        workspace_id: workspace.id,
      });
      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: 'Workspace Api Key list is successfully fetched.',
        edges: data,
        pageInfo: pageInfo,
      });
    },
  }
}

