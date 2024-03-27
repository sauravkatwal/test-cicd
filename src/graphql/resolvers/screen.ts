import { InformationEvent } from 'http';
import { CreditHelper, CursorPagination, SuccessResponse } from '../../helpers';
import { ArgsScreensInterface, ContextInterface, InputScreenInterface } from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { ScreenService } from '../../services';
import { createScreen, updateScreen } from '../../validators';
import { ServiceEnum } from '../../enums';

export const screenResolvers = {
  Mutation: {
    createScreen: async (
      parent: ParentNode,
      args: { input: InputScreenInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Guard.grantWorkspace(contextValue.workspace);
      Validator.check(createScreen, args.input);
      const data = await new ScreenService().create(args.input);

      return SuccessResponse.send({
        message: 'Screen is successfully created.',
        data: data,
      });
    },
    updateScreen: async (
      parent: ParentNode,
      args: { id: number; input: InputScreenInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Guard.grantWorkspace(contextValue.workspace);
      Validator.check(updateScreen, args.input);
      const data = await new ScreenService().updateOne(args.id, args.input);

      return SuccessResponse.send({
        message: 'Screen is successfully updated.',
        data: data,
      });
    },
    
    deleteScreen: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      await new ScreenService().deleteOne(args.id);
      return SuccessResponse.send({
        message: 'Screen is successfully deleted.',
      });
    },
  },
  Query: {
    screens: async (
      parent: ParentNode,
      args: ArgsScreensInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

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

      let { cursorCount, count, rows } = await new ScreenService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
      });

      const servicesAvailable = await CreditHelper.getAvailableServices({ workspaceId: workspace.id });
      if (servicesAvailable.length < 5) {
        if (!servicesAvailable.includes(ServiceEnum.bouncer)) {
          const response = rows.map((item) => {
            item.modules?.map((item) => {
              item.privileges?.filter((item) => item.id !== 53);
            });
          })
          await Promise.all(response)
        }
        if (!servicesAvailable.includes(ServiceEnum.email)) {
          await Promise.all([
            rows.map((item) => {
              item.modules?.map((item) => {
                item.privileges = item.privileges?.filter((item) => item.id !== 46 && item.id !== 54 && item.id !== 58);
              });
            }),
          ]);
        }
        if (!servicesAvailable.includes(ServiceEnum.viber)) {        
          await Promise.all([
            rows.map((item) => {
              item.modules?.map((item) => {
                item.privileges = item.privileges?.filter((item) => item.id !== 48 && item.id !== 55 && item.id !== 59);
              });
            }),
          ]);
        }
        if (!servicesAvailable.includes(ServiceEnum.whatsapp)) { 
          const response = 
          rows.map((item) => {
            item.modules?.map((item) => {
              item.privileges = item.privileges?.filter((item) => item.id !== 47 && item.id !== 56 && item.id !== 60);
            });
          });       
          await Promise.all(response);
        }
        if (!servicesAvailable.includes(ServiceEnum.sms)) {
          await Promise.all([
            rows.map((item) => {
              item.modules?.map((item) => {
                item.privileges = item.privileges?.filter((item) => item.id !== 49 && item.id !== 57 && item.id !== 61);
              });
            }),
          ]);
        }
      }

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: 'Screen list is successfully fetched.',
        edges: data,
        pageInfo
      });
    },

    screen: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const data = await new ScreenService().findByPk(args.id);
      return SuccessResponse.send({
        message: 'Screen details is successfully fetched.',
        data: data,
      });
    }
  },
};
