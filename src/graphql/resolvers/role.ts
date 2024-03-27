import { InformationEvent } from 'http';
import { CursorPagination, SuccessResponse } from '../../helpers';
import { ArgsRolesInterface, ContextInterface, InputRoleInterface } from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { RoleService } from '../../services';
import { createRole, updateRole } from '../../validators';

export const roleResolvers = {
  Mutation: {
    createRole: async (
      parent: ParentNode,
      args: { input: InputRoleInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Validator.check(createRole, args.input);
      args.input.workspaceId = workspace.id;
      const data = await new RoleService(contextValue.models!).create(args.input);

      return SuccessResponse.send({
        message: 'Role is successfully created.',
        data: data,
      });
    },
    updateRole: async (
      parent: ParentNode,
      args: { id: number; input: InputRoleInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Validator.check(updateRole, args.input);
      const data = await new RoleService(contextValue.models!).updateOne(args.id, args.input, workspace.id);

      return SuccessResponse.send({
        message: 'Role is successfully updated.',
        data: data,
      });
    },
    deleteRole: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      await new RoleService(contextValue.models!).deleteOne(args.id);

      return SuccessResponse.send({
        message: 'Role is successfully deleted.',
      });
    },
  },
  Query: {
    roles: async (
      parent: ParentNode,
      args: ArgsRolesInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });

      const { cursorCount, count, rows } = await new RoleService(contextValue.models!).findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
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
        message: 'Roles list is successfully fetched.',
        data: data,
        pageInfo: pageInfo,
      });
    },
    role: async (parent: ParentNode, args: { id: number }, contextValue: ContextInterface, info: InformationEvent) => {
      Guard.grant(contextValue.user);
      const data = await new RoleService(contextValue.models!).findByPk(args.id);

      return SuccessResponse.send({
        message: 'Role details is successfully fetched.',
        data: data,
      });
    },
  },
};
