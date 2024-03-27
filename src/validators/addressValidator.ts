import Joi from 'joi';
import { stringSchema } from './schemas';

const createAddress = Joi.object({
  street: stringSchema.label('Street').required(),
  suburb: stringSchema.label('Suburb').optional().allow(null, ''),
  state: stringSchema.label('State').required(),
  country: stringSchema.label('Country').required(),
  postalCode: stringSchema.label('Postal Code').allow(null, ''),
});

const updateAddress = Joi.object({
  street: stringSchema.label('Street').optional().allow(null, ''),
  suburb: stringSchema.label('Suburb').optional().allow(null, ''),
  state: stringSchema.label('State').optional().allow(null, ''),
  country: stringSchema.label('Country').optional().allow(null, ''),
  postalCode: stringSchema.label('Postal Code').allow(null, ''),
});

export { createAddress, updateAddress };
