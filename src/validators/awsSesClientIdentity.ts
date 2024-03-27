import Joi from 'joi';
import { IdentityType } from '../enums';
import { list } from '../utils';
import { stringSchema } from './schemas';

const createIdentity = Joi.object({
  identity: stringSchema.required().label('Identity'),
  type: stringSchema
    .required()
    .label('Type')
    .allow(...list(IdentityType)),
});

const deleteIdentity = Joi.object({
  identity: stringSchema.required().label('Identity'),
});

export { createIdentity, deleteIdentity };
