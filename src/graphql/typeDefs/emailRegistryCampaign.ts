import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const emailRegistryCampaignDefs: DocumentNode = gql`
  #graphql

  enum ReportStatusEnum {
    pending
    delivered
    bounced
  }

  input InputEmailRegistryCampaign {
    email_registry_id: Int
    campaign_id: Int
  }

  type SingleEmailRegistryCampaign {
    message: String
    data: EmailRegistryCampaign
  }

  type EmailListWithStats {
    email: String
    name: String
    phoneNumber: String
    status: ReportStatusEnum
  }

  type EmailListEdge {
    node: EmailListWithStats
    cursor: String
  }

  type EmailList {
    message: String
    edges: [EmailListEdge]
    pageInfo: PageInfo
  }

  type EmailRegsitryCount {
    count: Int
  }

  type CampaignEmailRegistryGroupEmailRegistriesCount {
    message: String
    data: EmailRegsitryCount
  }

  extend type Query {
    emailRegistryCampaignReport(
      campaign_id: Int!
      email_registry_group_id: Int
      email_registry_id: Int
      first: Int
      last: Int
      after: String
      before: String
      fromDate: Date
      toDate: Date
    ): EmailList
    campaignEmailRegistryGroupEmailRegistriesCount(
      campaign_id: Int!
      email_registry_group_id: Int!
    ): CampaignEmailRegistryGroupEmailRegistriesCount
  }
`;
