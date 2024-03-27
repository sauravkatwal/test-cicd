import * as Sequelize from "sequelize";

export interface InputWorkspaceLoginInterface {
  workspace_id: Sequelize.CreationOptional<number>;
  user_id: Sequelize.CreationOptional<number>;
}

export interface InputConfirmSignUpInterface {
  email: string;
  confirmation_code: string;
}

export interface InputResendConfirmationCodeInterface {
  email: string;
}

export interface InputAuthLoginInterface {
  email: string;
  password: string;
  rememberMe?: boolean;
  mfaOtp?: string;
}

export interface InputForgotPasswordInterface {
  email: string;
  password: string;
}

export interface InputConfirmForgotPasswordInterface {
  verification_code: string;
  new_password: string;
  email: string;
}
export interface InputChangePasswordInterface {
  accessToken: string;
  previousPassword: string;
  proposedPassword: string;
}
export interface InputAcceptInvitedWorkspaceMemberInterface {
  token: string;
  accept: boolean;
  password: string;
}
export interface InputAuthTokenInterface {
  accessToken: string;
}