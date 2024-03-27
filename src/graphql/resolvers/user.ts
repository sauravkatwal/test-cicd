import { GraphQLError } from 'graphql';
import { InformationEvent } from 'http';
import { defaultOrder, defaultSort, pgMaxLimit, pgMinLimit } from '../../config';
import { MessagingPlatformEnum, UserWorkspaceStatusEnum } from '../../enums';
import { Helper, SuccessResponse } from '../../helpers';
import { ArgsWorkspaceMembersInterface, ContextInterface, InputUserInterface, UserInterface } from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import {
  CredentialService,
  UserService,
  UserWorkspaceRoleService,
  UserWorkspaceService
} from '../../services';
import { AwsCognito, AwsSES } from '../../utils';
import { inviteWorkspaceMember, resendinviteWorkspaceMember, updateWorkspaceMember } from '../../validators';

export const userResolvers = {
  Mutation: {
    inviteWorkspaceMember: async (
      parent: ParentNode,
      args: { input: InputUserInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      Validator.check(inviteWorkspaceMember, args.input);
      args.input.email = args.input.email?.toLowerCase();
      let user: UserInterface = await new UserService().findOne({
        email: args.input.email,
        workspace_id: workspace.id,
      });

      if (!user) {
        user = await new UserService().create(args.input);
        const userWorkspace = await new UserWorkspaceService(contextValue.models!).create({
          user_id: user.id,
          workspace_id: workspace.id,
          role: args.input.role!,
        });
        const credentials = await new CredentialService(contextValue.models!).findOne(
          { isActive: true, workspaceId: workspace.id },
          MessagingPlatformEnum.email,
        );
        await Helper.sendInvitationLink({
          email: user.email,
          subject: 'Member Invitation',
          userWorkspaceId: userWorkspace.id,
          credentials: credentials,
        });

        return SuccessResponse.send({
          message: 'Member is successfully invited.',
        });
      } else {
        if (user?.user_workspaces?.length === 1) {
          return Error(`Member is already associated with workspace: ${workspace.id}`);
        } else {
          return Error(`Member is already associated with another workspace`);
        }
      }
    },
    updateWorkspaceMember: async (
      parent: ParentNode,
      args: { id: number; input: InputUserInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(updateWorkspaceMember, args.input);
      if (args.id === user.id) {
        throw new GraphQLError(`I can not update your own user!`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'id',
          },
        });
      }
      const userWorkspaceExists = await new UserWorkspaceService().findOne({
        user_id: args.id,
        workspace_id: workspace.id,
      });
      if (!userWorkspaceExists) {
        throw new GraphQLError(`User: ${args.id} does not exist!`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'id',
          },
        });
      }
      await new UserWorkspaceRoleService(contextValue.models!).updateOne(userWorkspaceExists.id, { role: args.input.role! });

      return SuccessResponse.send({
        message: 'Member is successfully updated.',
      });
    },
    deactivateWorkspaceMember: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      if (args.id === user.id) {
        throw new GraphQLError(`I can not deactive your own user!`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'id',
          },
        });
      }
      const userWorkspaceExists = await new UserWorkspaceService().findOne({
        user_id: args.id,
        workspace_id: workspace.id,
      });
      if (!userWorkspaceExists) {
        throw new GraphQLError(`User: ${args.id} does not exist!`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'id',
          },
        });
      }
      await new UserWorkspaceService().updateOne(userWorkspaceExists.id, {
        status: UserWorkspaceStatusEnum.deactivated,
      });
      return SuccessResponse.send({
        message: 'Member is successfully deactivate.',
      });
    },
    resendInviteWorkspaceMember: async (
      parent: ParentNode,
      args: { input: InputUserInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      Validator.check(resendinviteWorkspaceMember, args.input);

      const userWorkspaceExists = await new UserWorkspaceService().findOne({
        email: args.input.email,
        workspace_id: workspace.id,
      });
      if (!userWorkspaceExists) {
        throw new GraphQLError(`User: ${args.input.email} does not exist!`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'email',
          },
        });
      }

      const link = Helper.generateInvitationLink({ workspace, user: userWorkspaceExists.user });
      const credentials = await new CredentialService(contextValue.models!).findOne(
        { isActive: true, workspaceId: workspace.id },
        MessagingPlatformEnum.email,
      );
      await new AwsSES(
        credentials.secret.awsSesAccessKeyId,
        credentials.secret.awsSesAccessKeySecret,
        credentials.secret.awsSesRegion,
      ).sendEmail({
        destination: [args.input.email!],
        subject: 'Member Invitation',
        content: `Your invitation link is: <a href=${link}>${link}</a>`,
      });

      return SuccessResponse.send({
        message: 'Member is successfully invited.',
      });
    },

    deleteWorkspaceMember: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      if (args.id === user.id) {
        throw new GraphQLError(`I can not delete your own user!`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'id',
          },
        });
      }
      const userWorkspaceExists = await new UserWorkspaceService().findOne({
        user_id: args.id,
        workspace_id: workspace.id,
      });
      if (!userWorkspaceExists) {
        throw new GraphQLError(`Member: ${args.id} does not exist!`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'id',
          },
        });
      }
      const userExists = await new UserService().findByPk(args.id);
      try {
        const cognitoUser = await AwsCognito.adminGetUser({ email: userExists.email });
        if (cognitoUser) {
          const param = {
            name: userExists.name,
            email: userExists.email,
            phone_number: userExists.phone_number,
          };
          await AwsCognito.removeUser(param);
        }
      } catch (error: any) {
        console.error(error.message);
      }
      await new UserWorkspaceService().deleteOne(userWorkspaceExists.id);
      await new UserService().deleteOne(args.id);

      return SuccessResponse.send({
        message: 'Member is successfully deleted.',
      });
    },
  },
  Query: {
    workspaceMembers: async (
      parent: ParentNode,
      args: ArgsWorkspaceMembersInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { offset, limit, query, sort, order, status } = args;
      offset = offset && offset > 0 ? offset - 1 : 0;
      limit = limit ? limit : pgMinLimit;
      limit = Math.min(limit, pgMaxLimit);
      query = query ? query : undefined;
      order = order ? order : defaultOrder;
      sort = sort ? sort : defaultSort;
      status = status ? status : undefined;

      const { count, rows: data } = await new UserService(contextValue.models!).findAndCountAll({
        offset,
        limit,
        query,
        sort,
        order,
        workspace_id: workspace.id,
        status,
      });

      return SuccessResponse.send({
        message: 'Members list is successfully fetched.',
        data: data,
        count: count,
      });
    },
  },
};
