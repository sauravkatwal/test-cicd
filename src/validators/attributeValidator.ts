import Joi from "joi";
import { stringSchema, booleanSchema } from "./schemas";

const createAttribute = Joi.object({
  name: stringSchema.label("Name").required(),
  description: stringSchema.label("Description").allow("",null),
  isActive: booleanSchema.label("Is Active").allow(null),
  isDefault: booleanSchema.label("Is Default").allow(null),
});

const updateAttribute = Joi.object({
  name: stringSchema.label("Name").allow("", null),
  description: stringSchema.label("Description").allow("", null),
  isActive: booleanSchema.label("Is Active").allow("", null),
  isDefault: booleanSchema.label("Is Default").allow("", null)
});

export { createAttribute, updateAttribute };
