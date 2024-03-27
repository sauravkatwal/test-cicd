// import joiDate from "@joi/date";
import joi from 'joi';

const Joi = joi as typeof joi;
// const JoiDate = joi.extend(joiDate) as typeof joi;

const stringSchema = Joi.string();

const numberSchema = Joi.number();

const positiveIntegerSchema = Joi.number().integer().min(1);

const positiveIntegerWithZeroSchema = Joi.number().integer().min(0);

const emailSchema = Joi.string()
  .email({ 
    minDomainSegments: 2, 
    // tlds: { allow: ['com', 'net'] } 
  })
  .lowercase();

const phoneSchema = Joi.string()
  .min(7)
  .max(14)
  .pattern(/^([+]|[00]{2})([0-9]|[ -])*/);

const urlSchema = Joi.string().uri();

const dateSchema = Joi.date();
// .format(["YYYY/MM/DD", "YYYY-MM-DD"]);

const timeSchema = Joi.string();
// date().format(["HH:mm:ss"]);

const dateAndTimeSchema = Joi.date();

const arraySchema = Joi.array();

const booleanSchema = Joi.boolean();

const anySchema = Joi.any();

const forbiddenSchema = Joi.forbidden();

export {
  stringSchema,
  positiveIntegerSchema,
  emailSchema,
  phoneSchema,
  urlSchema,
  dateSchema,
  timeSchema,
  dateAndTimeSchema,
  arraySchema,
  booleanSchema,
  anySchema,
  forbiddenSchema,
  positiveIntegerWithZeroSchema,
  numberSchema
};
