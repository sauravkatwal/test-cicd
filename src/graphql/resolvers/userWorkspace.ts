
import { InformationEvent } from 'http';
import { SuccessResponse } from '../../helpers';
import {
  InBetweenDateExtend,
  ContextInterface
} from '../../interfaces';
import { Guard, } from '../../middlewares';
import { UserWorkspaceRoleService } from '../../services';
import { RoleEnum } from '../../enums'
export const userWorkspaceResolvers = {

  Query: {
    userWorkspaceRoleCountSummaries: async (
      parent: ParentNode,
      args: InBetweenDateExtend,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      const result = await new UserWorkspaceRoleService(contextValue.models!).getWorkspaceUsersCount({workspaceId:workspace.id , fromDate, toDate });

      return SuccessResponse.send({
        message: 'Members Counts is successfully fetched.',
        data: result,
      });
    },
    },
  };


