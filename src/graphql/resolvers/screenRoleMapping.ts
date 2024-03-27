import { InformationEvent } from 'http';
import { CursorPagination, SuccessResponse } from '../../helpers';
import {
  ArgsScreenRoleMappingInterface,
  ContextInterface,
  InputScreenRoleMappingSlugInterface,
} from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { ScreenRoleMappingService } from '../../services';
import { createMultipleScreenRoleMapping, createScreenRoleMapping } from '../../validators';

export const screenRoleMappingResolvers = {
  Mutation: {
    createInputScreenRoleMapping: async (
      parent: ParentNode,
      args: { roleId: number; input: string },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const [screenSlug, moduleSlug, privilegeSlug] = args.input.split(':');
      const payload = { screenSlug, moduleSlug, privilegeSlug };
      Validator.check(createScreenRoleMapping, { screenSlug, moduleSlug, privilegeSlug });
      await new ScreenRoleMappingService(contextValue.models!).create(args.roleId, payload);

      return SuccessResponse.send({
        message: 'Screen role map is successfully created.',
      });
    },
    createMultipleInputScreenRoleMapping: async (
      parent: ParentNode,
      args: { roleId: number; input: string[] },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const multipleScreenRoles: InputScreenRoleMappingSlugInterface[] = args.input
        .filter((data) => {
          const [screenSlug, moduleSlug, privilegeSlug] = data.split(':');
          return screenSlug !== undefined && moduleSlug !== undefined && privilegeSlug !== undefined;
        })
        .map((data) => {
          const [screenSlug, moduleSlug, privilegeSlug] = data.split(':');
          return {
            screenSlug,
            moduleSlug,
            privilegeSlug,
          };
        });

      Validator.check(createMultipleScreenRoleMapping, multipleScreenRoles);
      await new ScreenRoleMappingService(contextValue.models!).bulkCreate(args.roleId, multipleScreenRoles);

      return SuccessResponse.send({
        message: 'Screen role map is successfully created.',
      });
    },
    updateScreenRoleMapping: async (
      parent: ParentNode,
      args: { roleId: number; input: string[] },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const multipleScreenRoles: InputScreenRoleMappingSlugInterface[] = args.input
        .filter((data) => {
          const [screenSlug, moduleSlug, privilegeSlug] = data.split(':');
          return screenSlug !== undefined && moduleSlug !== undefined && privilegeSlug !== undefined;
        })
        .map((data) => {
          const [screenSlug, moduleSlug, privilegeSlug] = data.split(':');
          return {
            screenSlug,
            moduleSlug,
            privilegeSlug,
          };
        });

      Validator.check(createMultipleScreenRoleMapping, multipleScreenRoles);
      await new ScreenRoleMappingService(contextValue.models!).bulkUpdate(args.roleId, multipleScreenRoles);

      return SuccessResponse.send({
        message: 'Screen role map is successfully Updated.',
      });
    },
  },
  Query: {
    screenRoleMappings: async (
      parent: ParentNode,
      args: ArgsScreenRoleMappingInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace)
      Guard.grant(contextValue.user);
      const { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });

      let { cursorCount, count, rows  } = await new ScreenRoleMappingService(contextValue.models!).findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
        roleId: args.roleId ,
        isActive: true,
      });


      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });
      
      return SuccessResponse.send({
        message: 'Roles map list is successfully fetched.',
        edges: data,
        pageInfo
      });
    },
  },
};
