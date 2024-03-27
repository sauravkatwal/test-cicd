import Joi from "joi";
import { RoleEnum } from "../enums";
import { list } from "../utils";
import { arraySchema, emailSchema, phoneSchema, stringSchema } from "./schemas";

const createUser = Joi.object({
  name: stringSchema.required().label("Name"),
  email: emailSchema.required().label("E-mail"),
  phone_number: phoneSchema.allow(null, "").label("Phone Number"),
  roles: stringSchema.required().label("Roles"),
});

const updateUser = Joi.object({
  name: stringSchema.optional().label("Name"),
  email: emailSchema.optional().label("E-mail"),
  phone_number: phoneSchema.optional().label("Phone Number"),
  roles: stringSchema.required().label("Roles"),
});

const inviteWorkspaceMember = Joi.object({
  name: stringSchema.required().label("Name"),
  email: emailSchema.required().label("E-mail"),
  phone_number: phoneSchema.allow(null, "").label("Phone Number"),
  role: stringSchema.required().label("Roles"),
});

const updateWorkspaceMember = Joi.object({
  role: stringSchema
    .required()
    .label('Role'),
});

const resendinviteWorkspaceMember = Joi.object({
  email: emailSchema.required().label('E-mail'),
});

export { createUser, updateUser, inviteWorkspaceMember, updateWorkspaceMember, resendinviteWorkspaceMember };
