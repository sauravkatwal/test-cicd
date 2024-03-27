import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const authDefs: DocumentNode = gql`
  #graphql

  input InputAuthUser {
    name: String
    email: String
    phone_number: String
    current_workspace_id: Int
  }

  input InputAuthLogin {
    email: String!
    password: String!
  }

  input InputAuthVerifyMfa {
    mfaOtp: String
    email: String!
    password: String!
    rememberMe: Boolean
  }

  input InputAdminLogin {
    email: String!
    password: String!
    rememberMe: Boolean
  }

  input InputForgotPassword {
    email: String!
  }

  input InputConfirmForgotPassword {
    verification_code: String!
    new_password: String!
    email: String!
  }

  input InputChangePassword {
    previousPassword: String
    proposedPassword: String
  }

  input InputAcceptInvitedWorkspaceMemberInterface {
    token: String!
    accept: Boolean!
    password: String
  }

  input InputVerifyInvitationToken {
    token: String!
  }

  input InputRefreshToken {
    refreshToken: String
  }

  type LoginToken {
    access: String
    refresh: String
  }

  type UserToken {
    user: User
    token: LoginToken
  }

  type Login {
    message: String
    data: UserToken
  }

  type RefreshTokenData {
    data: LoginToken
    message: String
  }

  type VerifyInvitationTokenResponse {
    passwordRequired: Boolean
    name: String
  }

  type VerifyInvitationToken {
    message: String
    data: VerifyInvitationTokenResponse
  }

  extend type Mutation {
    authMe(input: InputUser!): SingleUser
    login(input: InputAuthLogin!): Message
    resendTotpQR(input: InputAuthLogin!): Message
    verifyMFA(input: InputAuthVerifyMfa!): Login
    adminLogin(input: InputAdminLogin!): Login
    forgotPassword(input: InputForgotPassword): Message
    changePassword(input: InputChangePassword!): Message
    confirmForgotPassword(input: InputConfirmForgotPassword): Message
    acceptInvitedWorkspaceMember(input: InputAcceptInvitedWorkspaceMemberInterface): Message
    signOut: Message
    refreshToken(input: InputRefreshToken!): RefreshTokenData
    verifyInvitationToken(input: InputVerifyInvitationToken): VerifyInvitationToken
  }

  extend type Query {
    authMe: SingleUser
    myRolePrivilege: MultipleScreenRoleMappings
    myRoles: SingleUserWorkspace
  }
`;
