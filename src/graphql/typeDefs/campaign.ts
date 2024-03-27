import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const campaignDefs: DocumentNode = gql`
  #graphql
  scalar Scalar

  enum ScheduleStatusEnum {
    draft
    scheduled
    completed
    ongoing
    failed
  }

  enum CampaignApprovedStatus {
    approved
    pending
    rejected
  }

  input InputCampaign {
    name: String
    description: String
    replyEmail: String
    fromEmail: String
    plainText: String
    query: String
    trackingOpen: Boolean
    trackingClick: Boolean
    trackingDeliver: Boolean
    emailRegistryGroups: [Int]
    emailRegistries: [Int]
    module: String
    isArchive: Boolean
    subject: String
    schedule: InputCampaignSchedule
  }

  type EmailRegistryCampaign {
    id: Int
    emailRegistry: EmailRegistry
    campaignId: Int
    emailRegistryGroup: EmailRegistryGroup
  }

  type Receipt {
    emailRegistries: [Int]
    emailRegistryGroups: [Int]
  }

  type CampaignEmailsSummary {
    emailRegistryCount: Int
    emailOpenCount: Int
    emailClickCount: Int
  }

  type Campaign {
    id: Int
    name: String
    description: String
    fromEmail: String
    replyEmail: String
    plainText: String
    query: String
    trackingOpen: Boolean
    trackingClick: Boolean
    trackingDeliver: Boolean
    receipts: Receipt
    isArchive: Boolean
    subject: String
    summary: CampaignEmailsSummary
    createdAt: Date
    approvedStatus: CampaignApprovedStatus
    schedule: CampaignSchedule
  }

  type CampaignEdge {
    node: Campaign
    cursor: String
  }

  type CampaignList {
    message: String
    edges: [CampaignEdge]
    pageInfo: PageInfo
  }

  type SingleCampaign {
    message: String
    data: Campaign
  }

  type MultipleCampaign {
    message: String
    data: [Campaign]
  }

  type CampaignReport {
    message: String
    data: Scalar
  }

  extend type Mutation {
    createCampaign(input: InputCampaign!): SingleCampaign
    updateCampaign(id: Int!, input: InputCampaign!): SingleCampaign
    deleteCampaign(id: Int!): SingleCampaign
    updateCampaignEmailTemplate(id: Int!, input: InputEmailTemplate!): SingleCampaign
    approveCampaign(id: Int!, approvedStatus: CampaignApprovedStatus): SingleCampaign
  }

  extend type Query {
    campaigns(
      first: Int
      last: Int
      after: String
      before: String
      query: String
      status: [ScheduleStatusEnum]
      isArchive: Boolean
    ): CampaignList
    campaign(id: Int!): SingleCampaign
    campaignEmailReportCount(campaignId: Int!, fromDate: Date, toDate: Date): CampaignReport
    emailListFormCampaignReport(campaignId: Int!, reportType: String, fromDate: Date, toDate: Date): CampaignReport
    campaignReportTrackingCount(campaignId: Int!, fromDate: Date, toDate: Date): CampaignReport
    campaignReportTrackingList(campaignId: Int!, trackingType: String, fromDate: Date, toDate: Date): CampaignReport
    campaignReportFallbackCount(campaignId: Int!, fromDate: Date, toDate: Date): CampaignReport
    campaignReportFallbackList(campaignId: Int!, fallbackLevel: String, fromDate: Date, toDate: Date): CampaignReport
    campaignReportOverallCount(campaignId: Int!, fromDate: Date, toDate: Date): CampaignReport
    campaignReportReciepientCount(
      campaignId: Int!
      messagingPlatform: MessagingPlatformType
      fromDate: Date
      toDate: Date
    ): CampaignReport
    campaignReportReciepientList(
      campaignId: Int!
      reportType: String
      messagingPlatform: MessagingPlatformType
      fromDate: Date
      toDate: Date
      query: String
      offset: Int
      limit: Int
    ): CampaignReport
    campaignReportEngagementCount(
      campaignId: Int!
      messagingPlatform: MessagingPlatformType
      fromDate: Date
      toDate: Date
    ): CampaignReport
    campaignReportEngagementList(
      campaignId: Int!
      trackingType: String
      messagingPlatform: MessagingPlatformType
      fromDate: Date
      toDate: Date
      query: String
      offset: Int
      limit: Int
    ): CampaignReport
  }
`;
