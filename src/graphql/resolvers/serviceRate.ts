import { InformationEvent } from 'http';
import { CursorPagination, SuccessResponse } from '../../helpers';
import { ArgsServiceRateInterface, ContextInterface, InputServiceRateInterface } from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { ServiceRateService } from '../../services';
import { createServiceRate, updateServiceRate } from '../../validators';

export const ServiceRateResolvers = {
  Mutation: {
    adminCreateServiceRate: async (
      parent: ParentNode,
      args: { input: InputServiceRateInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);
      Validator.check(createServiceRate, args.input);
      const data = await new ServiceRateService().create(args.input);

      return SuccessResponse.send({
        message: 'ServiceRate is successfully created.',
        data: data,
      });
    },
    adminUpdateServiceRate: async (
      parent: ParentNode,
      args: { id: number; input: InputServiceRateInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);
      Validator.check(updateServiceRate, args.input);
      const data = await new ServiceRateService().updateOne(args.id, args.input);

      return SuccessResponse.send({
        message: 'ServiceRate is successfully updated.',
        data: data,
      });
    },
    adminDeleteServiceRate: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);
      await new ServiceRateService().deleteOne(args.id);

      return SuccessResponse.send({
        message: 'ServiceRate is successfully deleted.',
      });
    },
  },
  Query: {
    adminServiceRates: async (
      parent: ParentNode,
      args: ArgsServiceRateInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);
      const { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });

      const { cursorCount, count, rows } = await new ServiceRateService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
        workspaceId: args.workspaceId,
        service: args.service
      });

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: 'ServiceRates list is successfully fetched.',
        data: data,
        pageInfo: pageInfo,
      });
    },
  },
};
