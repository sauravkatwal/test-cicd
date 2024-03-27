import Joi from 'joi';
import { stringSchema, booleanSchema, numberSchema } from './schemas';

const createServiceRate = Joi.object({
	service: stringSchema.label('Service').required(),
  creditUnit: numberSchema.label('Credit Unit').optional().allow(null),
  amount: numberSchema.label('Level').required(),
});

const updateServiceRate = Joi.object({
	service: stringSchema.label('Service').optional(),
  creditUnit: numberSchema.label('Credit Unit').optional().allow(null),
  amount: numberSchema.label('Level').optional(),
});

export { createServiceRate, updateServiceRate };
