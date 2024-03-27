import Joi from 'joi';
import { positiveIntegerSchema, stringSchema, booleanSchema } from './schemas';

const createAttributeValue = Joi.object({
	value: stringSchema.label('Value').required(),
	description: stringSchema.label('Description').allow(null),
	is_active: booleanSchema.label('Is Active').allow(null),
	is_default: booleanSchema.label('Is Default').allow(null),
	attribute_id: positiveIntegerSchema.label('Attribute Id').allow("", null),
});

const updateAttributeValue = Joi.object({
	value: stringSchema.label('Value').allow("", null),
	description: stringSchema.label('Description').allow("", null),
	is_active: booleanSchema.label('Is Active').allow(null),
	is_default: booleanSchema.label('Is Default').allow(null),
	attribute_id: positiveIntegerSchema.label('Attribute Id').allow("", null)
});

export { createAttributeValue, updateAttributeValue };
