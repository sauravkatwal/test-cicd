import Joi from 'joi';
import { stringSchema, positiveIntegerSchema } from './schemas';

const createComment = Joi.object({
  campaignId: positiveIntegerSchema.label('Campaign Id').allow(null, ''),
  emailTemplateId: positiveIntegerSchema.label('Email Template Id').allow(null, ''),
  comment: stringSchema.required().label('Comment'), 
})
  .or('campaignId','emailTemplateId');

export { createComment };
