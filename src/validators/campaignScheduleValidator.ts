import Joi from 'joi';
import { arraySchema, dateSchema, positiveIntegerSchema, stringSchema, timeSchema } from './schemas';
import { MessagingPlatformEnum } from '../enums';
import { list } from '../utils';

const createFallbacks = Joi.object({
  scheduleDate: dateSchema.label('Schedule Date').required(),
  scheduleTime: timeSchema.label('Schedule Time').required(),
  templateId: positiveIntegerSchema.label('Template ID').required(),
  messagingPlatform: stringSchema.label('Status').valid(...list(MessagingPlatformEnum)),
  level: positiveIntegerSchema.label('Level').required(),
  type: stringSchema.label('Type').required(),
});

const createCampaignSchedule = Joi.object({
  scheduleDate: dateSchema.label('Schedule Date').required(),
  scheduleTime: timeSchema.label('Schedule Time').required(),
  timeZone: stringSchema.label('Time Zone').required(),
  templateId: positiveIntegerSchema.label('Template ID').required(),
  messagingPlatform: stringSchema.label('Status').valid(...list(MessagingPlatformEnum)),
  fallbacks: arraySchema.items(createFallbacks).allow(null, '')
});

export { createCampaignSchedule };
