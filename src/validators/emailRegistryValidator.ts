import Joi from 'joi';
import {
  numberSchema,
  arraySchema,
  booleanSchema,
  emailSchema,
  phoneSchema,
  positiveIntegerSchema,
  stringSchema,
  dateSchema
} from './schemas';

const createEmailRegistry = Joi.object({
  name: stringSchema.required().label('Name'),
  email: emailSchema.required().label('E-mail'),
  phoneNumber: phoneSchema.label('Phone Number').allow(null, ''),
  description: stringSchema.label('Description'),
  emailRegistryGroupId: positiveIntegerSchema.label('Email Registry Group Id'),
  emailRegistryGroupIds: arraySchema
    .items(positiveIntegerSchema.required().label('Email Registry Group Id'))
    .label('Email Registry Group Id'),
  genderId: numberSchema.label('Gender').allow(null, ''),
  dob: dateSchema.label('Date of Birth').allow(null, ''),
  nationalityId: numberSchema.label('Nationality ').allow(null, ''),
  provinceId: numberSchema.label('Province ').allow(null, ''),
  districtId: numberSchema.label('District ').allow(null, ''),
  municipality: stringSchema.label('Municipality').allow(null, ''),
  ward: numberSchema.label('Ward ').allow(null),
  profession: stringSchema.label('Profession ').allow(null, ''),
});


const createEmailRegistryImport = Joi.object({
  name: stringSchema.required().label('Name'),
  email: emailSchema.required().label('E-mail'),
  phoneNumber: phoneSchema.label('Phone Number').allow(null, ''),
  description: stringSchema.label('Description'),
  emailRegistryGroupId: positiveIntegerSchema.label('Email Registry Group Id'),
  emailRegistryGroupIds: arraySchema
    .items(positiveIntegerSchema.required().label('Email Registry Group Id'))
    .label('Email Registry Group Id'),
  gender: stringSchema.label('Gender').allow(null, ''),
  dob: dateSchema.label('Date of Birth').allow(null, ''),
  nationality: stringSchema.label('Nationality ').allow(null, ''),
  province: stringSchema.label('Province ').allow(null, ''),
  district: stringSchema.label('District ').allow(null, ''),
  genderId: numberSchema.label('Gender').allow(null, ''),
  nationalityId: numberSchema.label('Nationality ').allow(null, ''),
  provinceId: numberSchema.label('Province ').allow(null, ''),
  districtId: numberSchema.label('District ').allow(null, ''),
  municipality: stringSchema.label('Municipality').allow(null, ''),
  ward: numberSchema.label('Ward ').allow(null),
  profession: stringSchema.label('Profession ').allow(null, ''),
  groupLabel: stringSchema.label('Account Type ').allow(null, ''),
});

const updateEmailRegistry = Joi.object({
  name: stringSchema.label('Name').allow(null, ''),
  email: emailSchema.label('E-mail').allow(null, ''),
  phoneNumber: phoneSchema.allow(null, '').label('Phone Number').allow(null, ''),
  description: stringSchema.label('Description').allow(null, ''),
  genderId: numberSchema.label('Gender').allow(null, ''),
  dob: dateSchema.label('Date of Birth').allow(null, ''),
  nationalityId: numberSchema.label('Nationality ').allow(null, ''),
  provinceId: numberSchema.label('Province ').allow(null, ''),
  districtId: numberSchema.label('District ').allow(null, ''),
  municipality: stringSchema.label('Municipality').allow(null, ''),
  ward: numberSchema.label('Ward ').allow(null),
  profession: stringSchema.label('Profession ').allow(null, ''),
});

const createEmailRegistries = Joi.array().items(createEmailRegistryImport);

const createEmailRegistriesWithEmailRegistryGroup = Joi.object({
  emailRegistryGroupId: positiveIntegerSchema.label('Email Registry Group Id').required(),
  emailRegistryIds: arraySchema.items(positiveIntegerSchema).label('Email Registry Ids'),
  emailRegistries: arraySchema.items({
    name: stringSchema.required().label('Name'),
    email: emailSchema.required().label('E-mail'),
    phoneNumber: phoneSchema.label('Phone Number').allow(null, ''),
    description: stringSchema.label('Description'),
    emailRegistryGroupId: positiveIntegerSchema.label('Email Registry Group Id').allow(null, ''),
    emailRegistryGroupIds: arraySchema
      .items(positiveIntegerSchema.required().label('Email Registry Group Id'))
      .label('Email Registry Group Id').allow(null, ''),
    gender: stringSchema.label('Gender').allow(null, ''),
    dob: stringSchema.label('Date of Birth').allow(null, ''),
    nationality: stringSchema.label('Nationality ').allow(null, ''),
    province: stringSchema.label('Province ').allow(null, ''),
    district: stringSchema.label('District ').allow(null, ''),
    genderId: numberSchema.label('Gender').allow(null, ''),
    nationalityId: numberSchema.label('Nationality ').allow(null, ''),
    provinceId: numberSchema.label('Province ').allow(null, ''),
    districtId: numberSchema.label('District ').allow(null, ''),
    municipality: stringSchema.label('Municipality').allow(null, ''),
    ward: numberSchema.label('Ward ').allow(null),
    profession: stringSchema.label('Profession ').allow(null, ''),
  }),
  sanitize: booleanSchema.label('Sanitize'),
}).xor('emailRegistryIds', 'emailRegistries');

export {
  createEmailRegistry,
  updateEmailRegistry,
  createEmailRegistries,
  createEmailRegistriesWithEmailRegistryGroup
};
