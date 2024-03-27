import Joi, { ArraySchema, ObjectSchema } from 'joi';
import { stringSchema } from './schemas';

const createScreenPlanMapping: ObjectSchema<any> = Joi.object({
  moduleSlug: stringSchema.label('Module slug').required(),
  screenSlug: stringSchema.label('Screen slug').required(),
  privilegeSlug: stringSchema.label('Privilege slug').required(),
});

const createMultipleScreenPlanMapping: ArraySchema<any[]> = Joi.array().items(createScreenPlanMapping);

export { createScreenPlanMapping, createMultipleScreenPlanMapping };
