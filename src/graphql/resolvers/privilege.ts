import { InformationEvent } from 'http';
import { CursorPagination, SuccessResponse } from '../../helpers';
import { ArgsPrivilegesInterface, ContextInterface, InputPrivilegeInterface } from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { PrivilegeService } from '../../services';
import { createPrivilege, updatePrivilege } from '../../validators';

export const privilegeResolvers = {
  Mutation: {
    createPrivilege: async (
      parent: ParentNode,
      args: { input: InputPrivilegeInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Guard.grantWorkspace(contextValue.workspace);
      Validator.check(createPrivilege, args.input);
      const data = await new PrivilegeService().create(args.input);

      return SuccessResponse.send({
        message: 'Privilege is successfully created.',
        data: data,
      });
    },
    updatePrivilege: async (
      parent: ParentNode,
      args: { id: number; input: InputPrivilegeInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Guard.grantWorkspace(contextValue.workspace);
      Validator.check(updatePrivilege, args.input);
      const data = await new PrivilegeService().updateOne(args.id, args.input);

      return SuccessResponse.send({
        message: 'Privilege is successfully updated.',
        data: data,
      });
    },
    deletePrivilege: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      await new PrivilegeService().deleteOne(args.id);

      return SuccessResponse.send({
        message: 'privilege is successfully deleted.',
      });
    },
  },
  Query: {
    privileges: async (
      parent: ParentNode,
      args: ArgsPrivilegesInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
       Guard.grantWorkspace(contextValue.workspace);
      const { cursor, limit, order, sort, cursorSort, cursorOrder, query } =
      CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });

      const { cursorCount, count, rows } = await new PrivilegeService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
      });

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: 'Privileges list is successfully fetched.',
        edges: data,
        pageInfo
      });
    },
    privilege: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const data = await new PrivilegeService().findByPk(args.id);

      return SuccessResponse.send({
        message: 'Privilege is successfully fetched.',
        data: data,
      });
    },
  },
};
