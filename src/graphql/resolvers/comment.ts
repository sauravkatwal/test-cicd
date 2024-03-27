import { InformationEvent } from 'http';
import { CursorPagination, SuccessResponse } from '../../helpers';
import {
  ArgsCommentInterface,
  ContextInterface,
  InputCommentInterface,
} from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import {
  CommentService, UserWorkspaceService
} from '../../services';
import { createComment } from '../../validators';

export const commentResolvers = {
  Mutation: {
    createComment: async (
      parent: ParentNode,
      args: { input: InputCommentInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(createComment, args.input);
      args.input.workspaceId = workspace.id;
      args.input.createdById = user.user_workspaces[0].id
      const data = await new CommentService(contextValue.models!).create(args.input);

      return SuccessResponse.send({
        message: 'Comment is successfully created.',
        data: data,
      });
    },
  },
  Query: {
    comments: async (
      parent: ParentNode,
      args: ArgsCommentInterface,
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
      const { count, cursorCount, rows } = await new CommentService(contextValue.models!).findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
        campaignId: args.campaignId,
        emailTemplateId: args.emailTemplateId,
      });

      const convertedData: { name: string; email: string; date: any; comments: string[]; }[] = [];

      const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - date.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysDifference === 1) {
          return '1 day ago';
        } else {
          return `${daysDifference} days ago`;
        }
      }
      for (const item of rows) {
        const existingItem = convertedData.find(
          (convertedItem) =>
            convertedItem.name === item.userWorkspace!.user.name &&
            convertedItem.email === item.userWorkspace!.user.email
        );

        if (existingItem) {
          existingItem.comments.push(item.comment);
        } else {
          convertedData.push({
            name: item.userWorkspace!.user.name,
            email: item.userWorkspace!.user.email,
            date: formatDate(item.createdAt!),
            comments: [item.comment]
          });
        }
      }

      await Promise.all(convertedData);

      return SuccessResponse.send({
        message: 'Comment list is successfully fetched.',
        edges: convertedData,
      });
    },
    comment: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const data = await new CommentService(contextValue.models!).findByPk(args.id);
      return SuccessResponse.send({
        message: 'Comment details is successfully fetched.',
        data: data,
      });
    },
  },
};
