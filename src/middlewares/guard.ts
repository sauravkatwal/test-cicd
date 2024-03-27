import { AdminGetUserCommandOutput, GetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { GraphQLError } from 'graphql';
import { RoleEnum } from '../enums';
import { 
  InputUserInterface, 
  ModelsInterface, 
  ScreenRoleMappingInterface,
  UserInterface, 
  UserWorkspaceRoleInterface,
  WorkspaceInterface,
  
} from '../interfaces';
import { UserService, WorkspaceService,ScreenRoleMappingService, } from '../services';
import { AwsCognito } from '../utils';

class Guard {
  private static instance: Guard;

  private constructor() {}

  static get(): Guard {
    if (!Guard.instance) {
      Guard.instance = new Guard();
    }
    return Guard.instance;
  }

  auth = async (token: string, workspace: WorkspaceInterface | undefined): Promise<UserInterface> => {
    try {
      const verify = await AwsCognito.verifyToken(token);
      const userExists = await new UserService().findOne({
        sub: verify.sub,
        workspace_id: workspace?.id,
      });
      if (!userExists) {
        throw new GraphQLError(`Auth Failed`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'authorization',
            http: {
              status: 401,
            },
          },
        });
      }
      if (!userExists.email_verified || !userExists.phone_number_verified) {
        return this.verifyUser(userExists.id, token);
      }
      return userExists;
    } catch (error) {
      throw new GraphQLError(`Auth Failed`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'authorization',
          http: {
            status: 401,
          },
        },
      });
    }
  };

  registerUser = async (token: string, verify: CognitoAccessTokenPayload): Promise<UserInterface> => {
    const cognitoUser = await AwsCognito.getCognitoUser(token);
    if (!cognitoUser)
      throw new GraphQLError(`Auth Failed`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'authorization',
          http: {
            status: 401,
          },
        },
      });
    const input = this.formatCognitoUser({
      cognitoUser: cognitoUser,
      verify: verify,
    });
    return new UserService().create(input);
  };

  verifyUser = async (id: number, token: string): Promise<UserInterface> => {
    const cognitoUser = await AwsCognito.getCognitoUser(token);
    if (!cognitoUser)
      throw new GraphQLError(`Auth Failed`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'authorization',
          http: {
            status: 401,
          },
        },
      });
    const { email_verified, phone_number_verified } = this.formatCognitoUser({
      cognitoUser: cognitoUser,
    });
    return new UserService().updateOne(id, {
      email_verified,
      phone_number_verified,
    });
  };

  formatCognitoUser = ({
    cognitoUser,
    verify,
    role,
  }: {
    cognitoUser: GetUserCommandOutput | AdminGetUserCommandOutput;
    verify?: CognitoAccessTokenPayload;
    role?: RoleEnum;
  }): InputUserInterface => {
    return {
      sub: verify?.sub,
      name: cognitoUser.UserAttributes?.find((item) => item.Name === 'name')?.Value,
      username: cognitoUser.Username,
      email: cognitoUser.UserAttributes?.find((item) => item.Name === 'email')?.Value,
      email_verified: Boolean(cognitoUser.UserAttributes?.find((item) => item.Name === 'email_verified')?.Value),
      phone_number: cognitoUser.UserAttributes?.find((item) => item.Name === 'phone_number')?.Value,
      phone_number_verified: Boolean(
        cognitoUser.UserAttributes?.find((item) => item.Name === 'phone_number_verified')?.Value,
      ),
      roles: [role ?? RoleEnum.owner],
    };
  };

  grant = (user: UserInterface | undefined): UserInterface => {
    if (!user)
      throw new GraphQLError(`Auth Failed`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'authorization',
          http: {
            status: 401,
          },
        },
      });
    return user;
  };

  grantAdmin = (user: UserInterface | undefined) : UserInterface => {
    if (!user || user.userRole?.role?.slug !== RoleEnum.administrator)
      throw new GraphQLError(`Auth Failed`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'authorization',
          http: {
            status: 401,
          },
        },
      });
    return user;
  }

  checkWorkspace = async (secret: string): Promise<WorkspaceInterface> => {
    const workspaceExists = await new WorkspaceService().findOne({ secret });
    if (!workspaceExists)
      throw new GraphQLError(`Invalid workspace secret id`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'authorization',
          http: {
            status: 401,
          },
        },
      });
    return workspaceExists;
  };

  grantWorkspace = (workspace: WorkspaceInterface | undefined): WorkspaceInterface => {
    if (!workspace)
      throw new GraphQLError(`Invalid workspace secret id`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'authorization',
          http: {
            status: 401,
          },
        },
      });
    return workspace;
  };

  grantPermission = async ({
    userWorkspaceRoles,
    screenSlug,
    moduleSlug,
    privilegeSlug,
    models
  }: {
    userWorkspaceRoles: UserWorkspaceRoleInterface[];
    screenSlug: string;
    moduleSlug: string;
    privilegeSlug: string;
    models: ModelsInterface
  }): Promise<boolean> => {
    let roles: number[] = [];
    roles = userWorkspaceRoles?.map((item) => item?.role!.id) ?? [];
    let data: ScreenRoleMappingInterface | null;

    data = await new ScreenRoleMappingService(models).findOne({
      roleIds: roles,
      screenSlug: screenSlug,
      moduleSlug: moduleSlug,
      privilegeSlug: privilegeSlug,
    });
    if (!data) {
      throw new GraphQLError(`Role does not exist`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'role',
          http: {
            status: 401,
          },
        },
      });
    }
    return true;
  };
}

const guard = Guard.get();

export { guard as Guard };
