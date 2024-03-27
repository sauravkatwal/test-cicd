import Joi from 'joi';
import { positiveIntegerSchema } from './schemas';

const addEmailRegistryEmailRegistryGroup = Joi.object({
  emailRegistryId: positiveIntegerSchema.label('Email Registry Group Id'),
  emailRegistryGroupId: positiveIntegerSchema.label('Email Registry Group Id'),
});

export { addEmailRegistryEmailRegistryGroup };
