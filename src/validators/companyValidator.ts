import Joi from 'joi';
import { createAddress, updateAddress } from './addressValidator';
import { stringSchema, emailSchema, phoneSchema } from './schemas';

const createCompany = Joi.object({
  name: stringSchema.label('Name').required(),
  registration_number: stringSchema.label('Registration Number').required(),
  address: createAddress,
});

const updateCompany = Joi.object({
  name: stringSchema.label('Name').optional().allow(null, ''),
  registration_number: stringSchema.label('Registration Number').optional().allow(null, ''),
  address: updateAddress,
});

const createPointOfContact = Joi.object({
  firstName: stringSchema.label('First Name').required(),
  lastName: stringSchema.label('Last Name').required(),
  email: emailSchema.label('Email').required(),
  jobTitle: stringSchema.label('Job Title').required(),
  jobPosition: stringSchema.label('Job Position').required(),
  phoneNumber: phoneSchema.label('Phone Number').required(),
});

const updatePointOfContact = Joi.object({
  firstName: stringSchema.label('First Name').optional().allow(null, ''),
  lastName: stringSchema.label('Last Name').optional().allow(null, ''),
  email: emailSchema.label('Email').optional().allow(null, ''),
  jobTitle: stringSchema.label('Job Title').optional().allow(null, ''),
  jobPosition: stringSchema.label('Job Position').optional().allow(null, ''),
  phoneNumber: phoneSchema.label('Phone Number').optional().allow(null, ''),
});

export { createCompany, createPointOfContact, updateCompany, updatePointOfContact };
