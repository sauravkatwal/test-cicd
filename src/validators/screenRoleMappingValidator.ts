import Joi, { ArraySchema, ObjectSchema } from 'joi';
import { numberSchema, stringSchema } from './schemas';

const createScreenRoleMapping: ObjectSchema<any> = Joi.object({
  moduleSlug: stringSchema.label('Module slug').required(),
  screenSlug: stringSchema.label('Screen slug').required(),
  privilegeSlug: stringSchema.label('Privilege slug').required(),
});

const createMultipleScreenRoleMapping: ArraySchema<any[]> = Joi.array().items(createScreenRoleMapping);

export { createScreenRoleMapping,createMultipleScreenRoleMapping }