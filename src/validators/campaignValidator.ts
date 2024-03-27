import Joi, { number } from 'joi';
import { createCampaignSchedule } from './campaignScheduleValidator';
import { arraySchema, booleanSchema, positiveIntegerSchema, stringSchema } from './schemas';
import { list } from '../utils';
import { CampaignApprovedStatus, MessagingPlatformEnum } from '../enums';

const createCampaign = Joi.object({
  name: stringSchema.label('Name').required(),
  description: stringSchema.label('Description'),
  replyEmail: stringSchema.label('Reply').allow(null, ''),
  fromEmail: stringSchema.label('From').allow(null, ''),
  plainText: stringSchema.label('Plain Text').allow(null, ''),
  query: stringSchema.label('Query').allow(null, ''),
  module: stringSchema.label('Module').required(),
  subject: stringSchema.label('Subject').allow(null, ''),
  trackingOpen: booleanSchema.label('Tracking Open').allow(null),
  trackingClick: booleanSchema.label('Tracking Click').allow(null),
  trackingDeliver: booleanSchema.label('Tracking Deliver').allow(null),
  emailRegistryGroups: arraySchema.items(positiveIntegerSchema.label('Email Regestry Groups').allow(null, '')),
  emailRegistries: arraySchema.items(positiveIntegerSchema.label('Email Registries')).allow(null, ''),
  schedule: createCampaignSchedule,
})
  .or('emailRegistryGroups', 'emailRegistries')
  .when(
    Joi.object({ emailRegistryGroups: arraySchema.length(0), emailRegistries: arraySchema.length(0) }).or(
      'emailRegistryGroups',
      'emailRegistries',
    ),
    {
      then: Joi.object({ emailRegistryGroups: arraySchema.required(), emailRegistries: arraySchema.required() }),
    },
  );



  const updateCampaign = Joi.object({
    name: stringSchema.label('Name'),
    description: stringSchema.label('Description'),
    replyEmail: stringSchema.label('Reply').allow(null, ''),
    fromEmail: stringSchema.label('From').allow(null, ''),
    plainText: stringSchema.label('Plain Text').allow(null, ''),
    query: stringSchema.label('Query').allow(null, ''),
    module: stringSchema.label('Module'),
    subject: stringSchema.label('Subject').allow(null, ''),
    trackingOpen: booleanSchema.label('Tracking Open').allow(null),
    trackingClick: booleanSchema.label('Tracking Click').allow(null),
    trackingDeliver: booleanSchema.label('Tracking Deliver').allow(null),
    emailRegistryGroups: arraySchema.items(positiveIntegerSchema.label('Email Regestry Groups').allow(null, '')),
    emailRegistries: arraySchema.items(positiveIntegerSchema.label('Email Registries')),
    emailTemplateId: positiveIntegerSchema.label('Email Template ID'),
    campaignSchedule: createCampaignSchedule,
    messagingPlatform:  stringSchema.label('Status').valid(...list(MessagingPlatformEnum)),
    isArchive: booleanSchema.label('Is Archive').allow(null, ''),
    approvedStatus: stringSchema.label('Status').valid(...list(CampaignApprovedStatus)),
    schedule: createCampaignSchedule,
  });
export { createCampaign,updateCampaign };
