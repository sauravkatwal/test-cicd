import { ScreenStatusEnum } from '../enums';
import Joi from 'joi';
import { stringSchema } from './schemas';
import { list } from '../utils';

const createScreen = Joi.object({
  name: stringSchema.label('Name').required(),
  status: stringSchema
    .label('Status')
    .required()
    .valid(...list(ScreenStatusEnum)),
  description: stringSchema.label('Description').optional(),
});

const updateScreen = Joi.object({
  name: stringSchema.label('Name').optional().allow('', null),
  status: stringSchema
    .label('Status')
    .optional()
    .valid(...list(ScreenStatusEnum)),
  description: stringSchema.label('Description').optional(),
});

export { createScreen, updateScreen };
