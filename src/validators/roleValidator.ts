import Joi from 'joi';
import { stringSchema, booleanSchema, numberSchema } from './schemas';

const createRole = Joi.object({
	label: stringSchema.label('Label').required(),
	level: numberSchema.label('Level').optional().allow(null),
	isActive: booleanSchema.label('Is Active').optional().allow(null),
	position: numberSchema.label('Position').optional().allow(null),
});

const updateRole = Joi.object({
	label: stringSchema.label('Label').optional().allow(null, ''),
	level: numberSchema.label('Level').optional().allow(null),
	isActive: booleanSchema.label('Is Active').optional().allow(null),
	position: numberSchema.label('Position').optional().allow(null),
});

export { createRole, updateRole };
