import Joi from 'joi';
import { arraySchema, booleanSchema, emailSchema, phoneSchema, positiveIntegerSchema, stringSchema } from './schemas';

const createTestEmailRegistry = Joi.object({
  name: stringSchema.label('Name').required(),
  email: emailSchema.label('E-mail').allow(null, ''),
  phoneNumber: phoneSchema.label('Phone Number').allow(null, ''),
  description: stringSchema.label('Description').allow(null, ''),
  emailRegistryGroupId: positiveIntegerSchema.label('Email Registry Group Id').allow(null, ''),
  emailRegistryGroupIds: arraySchema
    .items(positiveIntegerSchema.required().label('Email Registry Group Id'))
    .label('Email Registry Group Id').allow(null, ''),
}).when(
  Joi.object({
    phoneNumber: phoneSchema.allow('', null),
    email: emailSchema.allow('', null)
  }).or('phoneNumber', 'email'),
  {
    then: Joi.object({
      phoneNumber: phoneSchema.optional(),
      email: emailSchema.optional()
    })
  }
).or('phoneNumber', 'email');

const updateTestEmailRegistry = Joi.object({
  name: stringSchema.label('Name').allow(null, ''),
  email: emailSchema.label('E-mail').allow(null, ''),
  phoneNumber: phoneSchema.allow(null, '').label('Phone Number').allow(null, ''),
  description: stringSchema.label('Description').allow(null, ''),
});

const createTestEmailRegistries = Joi.array().items(createTestEmailRegistry);

const createTestEmailRegistriesWithEmailRegistryGroup = Joi.object({
  emailRegistryGroupId: positiveIntegerSchema.label('Email Registry Group Id').required(),
  emailRegistryIds: arraySchema.items(positiveIntegerSchema).label('Email Registry Ids'),
  emailRegistries: arraySchema.items({
    name: stringSchema.label('Name').allow(null, ''),
    email: emailSchema.label('E-mail').allow(null, ''),
    phoneNumber: phoneSchema.label('Phone Number').allow(null, ''),
    description: stringSchema.label('Description').allow(null, ''),
  }),
  sanitize: booleanSchema.label('Sanitize'),
}).xor('emailRegistryIds', 'emailRegistries');

export { createTestEmailRegistry, updateTestEmailRegistry, createTestEmailRegistries, createTestEmailRegistriesWithEmailRegistryGroup };
