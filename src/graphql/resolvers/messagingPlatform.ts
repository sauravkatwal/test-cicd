import { InformationEvent } from 'http';
import { CursorPagination, SuccessResponse } from '../../helpers';
import { ArgsMessagingPlatformInterface, ContextInterface } from '../../interfaces';
import { Guard } from '../../middlewares';
import { MessagingPlatformService } from '../../services';

export const messagingPlatformResolvers = {
  Query: {
    messagingPlatforms: async (
      parent: ParentNode,
      args: ArgsMessagingPlatformInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
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

      const { cursorCount, count, rows } = await new MessagingPlatformService(contextValue.models!).findAndCountAll({
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
        message: ' Messaging Platform Report is successfully fetched.',
        data: data,
        pageInfo: pageInfo,
      });
    },
  },
};
