import Joi from 'joi';
import { EmailRegistryGroupStatusEnum, EmailRegistryGroupTypesEnum } from '../enums';
import { list } from '../utils';
import { anySchema, arraySchema, booleanSchema, emailSchema, phoneSchema, positiveIntegerSchema, stringSchema } from './schemas';

const createEmailRegistryGroup = Joi.object({
  label: stringSchema.required().label('Label'),
  status: stringSchema.label('Status').valid(...list(EmailRegistryGroupStatusEnum)),
  type: stringSchema.label('type').valid(...list(EmailRegistryGroupTypesEnum)),
  emailRegistries: Joi.alternatives()
    .conditional('csvData', {
      is: Joi.exist(),
      then: Joi.forbidden().error(new Error('"Email Registries" field is not allowed when "CsvData" is present')),
      otherwise: arraySchema.items(positiveIntegerSchema.label('Email Registry')).unique().label('Email Registries').allow(null)
    }),
  sanitize: Joi.alternatives().conditional('type', {
    is: 'email',
    then: booleanSchema.required().label('Sanitize'),
    otherwise: Joi.forbidden().error(new Error('"Sanitize" field is not allowed for this type'))
  }).label('Sanitize'),
  isExistingCriteria: booleanSchema.label('Tracking Open').allow(null).allow(null, ''),
  filterCriteria: anySchema.label('Filter Criteria').allow(null, ''),
  csvData: Joi.alternatives()
    .conditional('emailRegistries', {
      is: Joi.exist(),
      then: Joi.forbidden().error(new Error('"CsvData" field is not allowed when "Email Registries" is present')),
      otherwise: anySchema.label('CsvData').allow(null, '')
    }),
  description: stringSchema.label('Description').required(),
});


const updateEmailRegistryGroup = Joi.object({
  label: stringSchema.label('Label').allow(null, ''),
  status: stringSchema.label('Status').valid(...list(EmailRegistryGroupStatusEnum)),
  type: stringSchema.label('type').valid(...list(EmailRegistryGroupTypesEnum)),
});

const createEmailRegistryGroupWithEmailRegistries = Joi.object({
  label: stringSchema.label('Label').required(),
  status: stringSchema.label('Status').valid(...list(EmailRegistryGroupStatusEnum)),
  type: stringSchema.label('type').valid(...list(EmailRegistryGroupTypesEnum)),
  emailRegistries: arraySchema
    .items({
      name: stringSchema.required().label('Name'),
      email: emailSchema.required().label('E-mail'),
      phoneNumber: phoneSchema.label('Phone Number').allow(null, ''),
      description: stringSchema.required().label('Description'),
    })
    .label('Email Registries')
    .min(1),
  sanitize: Joi.alternatives().conditional('type', {
      is: 'email',
      then: booleanSchema.required().label('Sanitize'),
      otherwise: Joi.forbidden().error(new Error('"Sanitize" field is not allowed for this type'))
    }).label('Sanitize')
});

const createEmailRegistryGroupWithExistingEmailRegistries = Joi.object({
  label: stringSchema.label('Label').required(),
  status: stringSchema.label('Status').valid(...list(EmailRegistryGroupStatusEnum)),
  type: stringSchema.label('type').valid(...list(EmailRegistryGroupTypesEnum)),
  emailRegistries: arraySchema
    .items(positiveIntegerSchema.label('Email Registry').required())
    .label('Email Registries')
    .min(1),
  sanitize: Joi.alternatives().conditional('type', {
      is: 'email',
      then: booleanSchema.required().label('Sanitize'),
      otherwise: Joi.forbidden().error(new Error('"Sanitize" field is not allowed for this type'))
    }).label('Sanitize'),
});

export {
  createEmailRegistryGroup,
  updateEmailRegistryGroup,
  createEmailRegistryGroupWithEmailRegistries,
  createEmailRegistryGroupWithExistingEmailRegistries,
};
