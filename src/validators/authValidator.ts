import Joi from "joi";
import {
  booleanSchema,
  emailSchema,
  phoneSchema,
  positiveIntegerSchema,
  stringSchema,
} from "./schemas";

const signUp = Joi.object({
  name: stringSchema.label("Name").required(),
  email: emailSchema.label("E-mail").required(),
  phone_number: phoneSchema.allow(null, "").label("Phone Number"),
  password: stringSchema.label("Password").required(),
});

const confirmSignUp = Joi.object({
  email: emailSchema.label("E-mail").required(),
  confirmation_code: stringSchema.required().label("Confirmation Code"),
});

const resendConfirmationCode = Joi.object({
  email: emailSchema.label("E-mail").required(),
});

const workspaceLogin = Joi.object({
  workspace_id: positiveIntegerSchema.required().label("Workspace Id"),
});

const acceptInvitedWorkspaceMember = Joi.object({
  token: stringSchema.required().label("Token"),
  accept: booleanSchema.required().label("Accept"),
  password: stringSchema.label("Password"),
});

const confirmForgotPassword = Joi.object({
  verification_code: stringSchema.label("Verification Code"),
  new_password: stringSchema.label("New Password"),
  email: emailSchema.label("Verification Code"),
});

const changePassword = Joi.object({
  previousPassword: stringSchema.label('Previous Password').required(),
  proposedPassword: stringSchema.label('Proposed Password')
    .not(Joi.ref('previousPassword')).label('Proposed Password')
    .required(),
});


const forgotPassword = Joi.object({
  email: emailSchema.label("Verification Code"),
});

const login = Joi.object({
  email: emailSchema.label("E-mail").required().trim(),
  password: stringSchema.label("Password").required(),
  rememberMe:booleanSchema.allow(null, "").label("Remember Me"), 
  mfaOtp: stringSchema.label('Mfa Otp').allow(null, '').optional()
});

const authMe = Joi.object({
  name: stringSchema.label("Name"),
  phone_number: phoneSchema.allow(null, "").label("Phone Number"),
});

export {
  signUp,
  confirmSignUp,
  workspaceLogin,
  resendConfirmationCode,
  acceptInvitedWorkspaceMember,
  confirmForgotPassword,
  forgotPassword,
  login,
  authMe,
  changePassword,
};
