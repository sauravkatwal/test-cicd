import { InformationEvent } from 'http';
import { CursorPagination, SuccessResponse } from '../../helpers';
import { ArgsModulesInterface, ContextInterface, InputModuleInterface } from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { ModuleService } from '../../services';
import { createModule, updateModule } from '../../validators';

export const moduleResolvers = {
  Mutation: {
    createModule: async (
      parent: ParentNode,
      args: { input: InputModuleInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
       Guard.grantWorkspace(contextValue.workspace);
      Validator.check(createModule, args.input);
      const data = await new ModuleService().create(args.input);
      return SuccessResponse.send({
        message: 'Module is successfully created.',
        data: data,
      });
    },

    updateModule: async (
      parent: ParentNode,
      args: { id: number; input: InputModuleInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Guard.grantWorkspace(contextValue.workspace);
      Validator.check(updateModule, args.input);
      const data = await new ModuleService().updateOne(args.id, args.input);

      return SuccessResponse.send({
        message: 'Module is successfully updated.',
        edges: data,
      });
    },

     deleteModule: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      await new ModuleService().deleteOne(args.id);
      return SuccessResponse.send({
        message: 'Module is successfully deleted.',
      });
    },
  },
  Query: {
    modules: async (
      parent: ParentNode,
      args: ArgsModulesInterface,
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

      const { cursorCount, count, rows } = await new ModuleService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query
      });

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: 'Module list is successfully fetched.',
        edges: data,
        pageInfo
      });
    },
  },
};
