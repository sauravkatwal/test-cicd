import Joi from 'joi';
import { stringSchema, numberSchema } from './schemas';

const createPrivilege = Joi.object({
  name: stringSchema.label('Name').required(),
  moduleId: numberSchema.label('Module Id').required(),
  description: stringSchema.label('description').allow(null, ''),
});

const updatePrivilege = Joi.object({
  name: stringSchema.label('Name').required(),
  moduleId: numberSchema.label('Module Id').optional(),
  description: stringSchema.label('description').allow(null, ''),
});

export { createPrivilege, updatePrivilege };
