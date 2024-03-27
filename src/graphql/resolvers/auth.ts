import { InformationEvent } from 'http';
import { GraphQLError } from 'graphql';
import { RoleEnum, ServiceEnum, UserWorkspaceStatusEnum } from '../../enums';
import { CreditHelper, Helper, SuccessResponse } from '../../helpers';
import {
  ContextInterface,
  InputAcceptInvitedWorkspaceMemberInterface,
  InputAuthLoginInterface,
  InputConfirmForgotPasswordInterface,
  InputForgotPasswordInterface,
  InputResendConfirmationCodeInterface,
  InputUserInterface,
  InputChangePasswordInterface,
} from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import {
  UserService,
  UserWorkspaceService,
  WorkspaceService,
  ScreenRoleMappingService,
  TransactionService,
  IdentityVerificationService,
} from '../../services';
import { AwsCognito } from '../../utils';
import {
  acceptInvitedWorkspaceMember,
  authMe,
  confirmForgotPassword,
  forgotPassword,
  login,
  resendConfirmationCode,
  changePassword,
} from '../../validators';

export const authResolvers = {
  Mutation: {
    authMe: async (
      parent: ParentNode,
      args: { input: InputUserInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const user = Guard.grant(contextValue.user);
      Validator.check(authMe, args.input);
      const data = await new UserService().updateOne(user.id, args.input);

      return SuccessResponse.send({
        message: 'Auth user is successfully updated.',
        data: data,
      });
    },
    login: async (
      parent: ParentNode,
      args: { input: InputAuthLoginInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Validator.check(login, args.input);
      await AwsCognito.authenticateUser(args.input);

      return SuccessResponse.send({
        message: 'Login successfully',
      });
    },
    adminLogin: async (
      parent: ParentNode,
      args: { input: InputAuthLoginInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Validator.check(login, args.input);
      const awsCognitoAuth = await AwsCognito.authenticateAdmin(args.input);
      const access = awsCognitoAuth.getAccessToken().getJwtToken() as string;
      const refresh = awsCognitoAuth.getRefreshToken().getToken() as string;
      const sub = awsCognitoAuth.getAccessToken().payload.sub as string;
      const subExists = await new UserService().findOne({ sub: sub });
      const user = await new UserService().findByPk(subExists.id);
      if(user.userRole?.role?.slug !== RoleEnum.administrator){
        throw new GraphQLError(`Auth Failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            argumentName: "authorization",
            http: {
              status: 401,
            },
          },
        });
      }
      return SuccessResponse.send({
        message: 'Login successfully',
        data: {
          token: {
            access: access,
            refresh: args.input.rememberMe ? refresh : null,
          },
          user: user,
        },
      });
    },
    verifyMFA: async (
      parent: ParentNode,
      args: { input: InputAuthLoginInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Validator.check(login, args.input);
      const awsCognitoAuth = await AwsCognito.authenticateUserMfa(args.input);
      const access = awsCognitoAuth.getAccessToken().getJwtToken() as string;
      const refresh = awsCognitoAuth.getRefreshToken().getToken() as string;
      const sub = awsCognitoAuth.getAccessToken().payload.sub as string;
      const subExists = await new UserService().findOne({ sub: sub });
      const user = await new UserService().findByPk(subExists.id);
      return SuccessResponse.send({
        message: 'MFA verification Success!!',
        data: {
          token: {
            access: access,
            refresh: args.input.rememberMe ? refresh : null,
          },
          user: user,
        },
      });
    },
    resendTotpQR: async (
      parent: ParentNode,
      args: { input: InputAuthLoginInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Validator.check(login, args.input);
      await AwsCognito.resetUserMfaPreference(args.input);
      await AwsCognito.authenticateUser(args.input);

      return SuccessResponse.send({
        message: 'Please check your email.',
      });
    },    
    signOut: async (
      parent: ParentNode,
      args: undefined,
      contextValue: ContextInterface,
      info: InformationEvent,
    ): Promise<any> => {
      Guard.grant(contextValue.user);
      const token = contextValue.token as string;
      await AwsCognito.signOut({ accessToken: token });

      return SuccessResponse.send({
        message: 'User sign out successfully.',
      });
    },
    refreshToken: async (
      parent: ParentNode,
      args: { input: { refreshToken: string } },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const data = await AwsCognito.accessToken(args.input.refreshToken);
      return SuccessResponse.send({
        message: 'Access token fetched successfully.',
        data: {
          access: data.AuthenticationResult?.AccessToken,
          refresh: data.AuthenticationResult?.RefreshToken,
        },
      });
    },
    forgotPassword: async (
      parent: ParentNode,
      args: { input: InputForgotPasswordInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Validator.check(forgotPassword, args.input);
      await AwsCognito.forgotPassword(args.input);

      return SuccessResponse.send({
        message: 'please check your email',
      });
    },
    confirmForgotPassword: async (
      parent: ParentNode,
      args: { input: InputConfirmForgotPasswordInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Validator.check(confirmForgotPassword, args.input);
      await AwsCognito.confirmForgotPassword(args.input);

      return SuccessResponse.send({
        message: 'password changed successfully',
      });
    },
    changePassword: async (
      parent: ParentNode,
      args: { input: InputChangePasswordInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);

      Validator.check(changePassword, args.input);
      const token = contextValue.token as string;
      await AwsCognito.changePassword({ ...args.input, accessToken: token.replace('Bearer ', '') });

      return SuccessResponse.send({
        message: 'Password changed successfully',
      });
    },
    acceptInvitedWorkspaceMember: async (
      parent: ParentNode,
      args: { input: InputAcceptInvitedWorkspaceMemberInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Validator.check(acceptInvitedWorkspaceMember, args.input);
      
      const identity = await Helper.verifyToken(args.input.token);

      const userExists = await new UserService().findOne({ 
        email: identity.identity,
      });
      const userWorkspaceExists = await new UserWorkspaceService().findOne({
        user_id: userExists.id,
      });
      const workspaceExists = await new WorkspaceService().findByPk(userWorkspaceExists.workspace_id);
      if (!userExists || !workspaceExists || !userWorkspaceExists) {
        throw Error(`Invalid token: ${args.input.token}`);
      }
      await new UserWorkspaceService().updateOne(userWorkspaceExists.id, {
        status: args.input.accept ? UserWorkspaceStatusEnum.accepted : UserWorkspaceStatusEnum.declined,
      });

      if (args.input.password && !userExists.sub) {
        const awsUser = await AwsCognito.signUp({
          email: userExists.email,
          password: args.input.password,
          name: userExists.name,
          phone_number: userExists.phone_number,
        });
        await AwsCognito.adminConfirmSignUp({ username: userExists.email });
        await AwsCognito.adminUpdateUser({ sub: awsUser.UserSub, email_verified: true })
        await new UserService().updateOne(userExists.id, {
          sub: awsUser.UserSub,
          username: awsUser.UserSub,
        });
      }

      await new IdentityVerificationService().updateOne(identity.id, { expiryDate: new Date() })

      return SuccessResponse.send({
        message: `Invitation is successfully ${
          args.input.accept ? UserWorkspaceStatusEnum.accepted : UserWorkspaceStatusEnum.declined
        }.`,
      });
    },
    verifyInvitationToken: async (
      parent: ParentNode,
      args: { input: { token: string } },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const identity = await Helper.verifyToken(args.input.token);
      const userWorkspace = await new UserWorkspaceService().findByPk(identity.meta.userWorkspaceId);
      const user = await new UserService().findByPk(userWorkspace.user_id);

      return SuccessResponse.send({
        message: 'Identity token is valid',
        data: { passwordRequired: user.sub ? false : true, name: user.name },
      });
    },
  },
  Query: {
    authMe: async (parent: ParentNode, args: undefined, contextValue: ContextInterface, info: InformationEvent) => {
      const user = Guard.grant(contextValue.user);
      const data = await new UserService().findByPk(user.id);

      return SuccessResponse.send({
        message: 'Auth user is successfully fetched.',
        data: data,
      });
    },
    myRolePrivilege: async (
      parent: ParentNode,
      args: undefined,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const { user, userWorkspaceRoles } = Guard.grantWorkspace(contextValue.workspace);

      let roles: number[] = [];

      roles = userWorkspaceRoles?.map((item) => item.role!.id) ?? [];
      const data = await new ScreenRoleMappingService(contextValue.models!).findAll({ roleId: roles });

      return SuccessResponse.send({
        message: 'User role privilege fetched successfully.',
        edges: data,
      });
    },

    myRoles: async (parent: ParentNode, args: undefined, contextValue: ContextInterface, info: InformationEvent) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);

      const data = await new UserWorkspaceService(contextValue.models!).find(workspace.id, user.id);
      const servicesAvailable = await CreditHelper.getAvailableServices({ workspaceId: workspace.id });
      if(servicesAvailable.length < 5) {
        if(!servicesAvailable.includes(ServiceEnum.bouncer)) {
          data.role!.roleMaps = data.role!.roleMaps?.filter(item => item.id !== 53)
        }
        if(!servicesAvailable.includes(ServiceEnum.email)) {
          data.role!.roleMaps = data.role!.roleMaps?.filter(item => item.id !== 54 && item.id !== 41 && item.id !== 58);
        }
        if(!servicesAvailable.includes(ServiceEnum.viber)) {
          data.role!.roleMaps = data.role!.roleMaps?.filter(item => item.id !== 55 && item.id !== 43 && item.id !== 59);
        }
        if(!servicesAvailable.includes(ServiceEnum.whatsapp)) {
          data.role!.roleMaps = data.role!.roleMaps?.filter(item => item.id !== 56 && item.id !== 42 && item.id !== 60);
        }
        if(!servicesAvailable.includes(ServiceEnum.sms)) {
          data.role!.roleMaps = data.role!.roleMaps?.filter(item => item.id !== 57 && item.id !== 44 && item.id !== 61);
        }
      }

      return SuccessResponse.send({
        message: 'User role privilege fetched successfully.',
        edges: data,
      });
    },
  },
};
