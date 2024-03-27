import Joi from 'joi';
import {
  arraySchema, emailSchema,
  stringSchema,
  phoneSchema,
  numberSchema
} from './schemas';
import { createCompany, updateCompany, createPointOfContact, updatePointOfContact } from '.';

const createService = Joi.object({
  service: stringSchema.label('Service').required(),
  credit: numberSchema.label('Credit').required(),
  serviceRate: numberSchema.label('Service Rate').required(),
});

const createWorkspace = Joi.object({
  name: stringSchema.label('Name').required(),
  email: emailSchema.label('Email').required(),
  phone_number: phoneSchema.label('Phone Number').required(),
  companyInfo: createCompany,
  pointOfContact: createPointOfContact,
  services: arraySchema.items(createService).allow(null, ''),
});

const updateWorkspace = Joi.object({
  name: stringSchema.label('Name').required(),
  email: emailSchema.label('Email').required(),
  phone_number: phoneSchema.label('Phone Number').required(),
  companyInfo: updateCompany,
  pointOfContact: updatePointOfContact,
  services: arraySchema.items(createService).allow(null, ''),
});

export { createWorkspace, updateWorkspace };
