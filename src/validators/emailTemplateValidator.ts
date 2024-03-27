import Joi from 'joi';
import { anySchema, stringSchema } from './schemas';
import { MessagingPlatformEnum } from '../enums';
import { list } from '../utils';

const createEmailTemplate = Joi.object({
  name: stringSchema.required().label('Name'),
  messagingPlatform: stringSchema.label('Messaging_platform').valid(...list(MessagingPlatformEnum)),
  content: anySchema.label('Content').allow(null, ''),
  content_html: Joi.when('messagingPlatform', {
    is: MessagingPlatformEnum.sms,
    then: Joi.forbidden(),
    otherwise: anySchema.label('Content_html').required().allow(null, ''),
  }),
  description: stringSchema.label('Description').allow(null, ''),
  status: stringSchema.label('Status').allow(null, ''),
});

const updateEmailTemplate = Joi.object({
  name: stringSchema.label('Name').allow(null, ''),
  messagingPlatform: stringSchema.label('Messaging_platform').valid(...list(MessagingPlatformEnum)),
  content: anySchema.label('Content').allow(null, ''),
 content_html: Joi.when('messagingPlatform', {
  is: MessagingPlatformEnum.sms,
  then: Joi.forbidden(),
  otherwise: anySchema.label('Content_html').required().allow(null, ''),
}),
  description: stringSchema.label('Description').allow(null, ''),
  status: stringSchema.label('Status').allow(null, ''),
});

export { createEmailTemplate, updateEmailTemplate };
