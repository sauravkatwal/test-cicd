import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const campaignScheduleDefs: DocumentNode = gql`
  #graphql

  scalar Date
  scalar Time

  enum StatusEnum {
    draft
    scheduled
    completed
    ongoing
    failed
    pending
  }
  enum MessagingPlatformType {
    email
    whatsapp
    viber
    sms
  }

  enum FallbackTypeEnum {
    unclicked
    unopened
    undelivered
  }

  input InputFallbacks {
    scheduleDate: Date
    scheduleTime: Time
    level: Int
    type: FallbackTypeEnum
    templateId: Int
    messagingPlatform: MessagingPlatformEnum
  }

  input InputCampaignSchedule {
    scheduleDate: Date
    scheduleTime: Time
    timeZone: String
    templateId: Int
    messagingPlatform: MessagingPlatformEnum
    fallbacks: [InputFallbacks]
  }

  type Fallbacks {
    scheduleDate: Date
    scheduleTime: Time
    level: Int
    type: FallbackTypeEnum
    templateId: Int
    template: EmailTemplate
    cacheTemplate: EmailTemplate
    cacheTemplateId: Int
    messagingPlatformId: Int
    messagingPlatform: MessagingPlatform
  }

  type CampaignSchedule {
    id: Int
    scheduleDate: Date
    scheduleTime: Time
    timeZone: String
    status: StatusEnum
    campaign: Campaign
    parentId: Int
    level: Int
    templateId: Int
    template: EmailTemplate
    cacheTemplate: EmailTemplate
    type: FallbackTypeEnum
    messagingPlatformId: Int
    messagingPlatform: MessagingPlatform
    fallbacks: [Fallbacks]
  }

  type CampaignCount {
    status: String
    count: Int
  }

  type CampaignCountSummary {
    message: String
    data: [CampaignCount]
  }
  type SingleCampaignSchedule {
    message: String
    data: CampaignSchedule
  }
  type CampaignCounts {
    message: String
    data: Scalar
  }

  extend type Mutation {
    scheduleCampaign(campaignId: Int!): SingleCampaignSchedule
  }
  extend type Query {
    campaignStatusCountSummaries(fromDate: Date, toDate: Date): CampaignCountSummary
    campaignCountSummaries(fromDate: Date, toDate: Date): CampaignCounts
  }
`;
