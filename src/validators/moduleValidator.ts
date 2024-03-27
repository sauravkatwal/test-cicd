import Joi from 'joi';
import { numberSchema, stringSchema } from './schemas';

const createModule = Joi.object({
  name: stringSchema.label('Name').required(),
  screenId: numberSchema.label('Screen Id').required(),
});

const updateModule = Joi.object({
  name: stringSchema.label('Name').optional().allow(null, ''),
  screenId: numberSchema.label('Screen Id').optional().allow(null),
});

export { createModule, updateModule };
