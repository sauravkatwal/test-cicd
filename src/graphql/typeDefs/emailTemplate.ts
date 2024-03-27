import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const emailTemplateDefs: DocumentNode = gql`
  #graphql
  enum MessagingPlatformEnum {
    email
    whatsapp
    viber
    sms
  }

  enum EmailTemplateApprovedStatus {
    approved
    pending
    rejected
  }

  input InputEmailTemplate {
    name: String
    messagingPlatform: MessagingPlatformEnum
    content: Scalar
    content_html: Scalar
    description: String
  }

  input InputDuplicateEmailTemplate {
    name: String
    description: String
    messagingPlatform: MessagingPlatformEnum
  }
  input InputSendSampleEmailTemplate {
    destination: String
    content: Scalar
    subject: String
  }

  input InputSendTestSms {
    reciepient: String
    message: Scalar
  }

  input InputSendTestViverMessage {
    recipients: [String]
    content: Scalar
  }

  type EmailTemplate {
    id: Int
    name: String
    slug: String
    content: Scalar
    messagingPlatform: MessagingPlatformEnum
    content_html: Scalar
    description: String
    status: String
    templateCode: String
    createdAt: Date
    updatedAt: Date
    approvedStatus: EmailTemplateApprovedStatus
    created_by: User
    updateDeleteEnabled: Boolean
  }

  type EmailTemplateEdge {
    node: EmailTemplate
    cursor: String
  }
  type PaginationMultipleEmailTemplate {
    message: String
    edges: [EmailTemplateEdge]
    pageInfo: PageInfo
  }
  type SingleEmailTemplate {
    message: String
    data: EmailTemplate
  }

  type MultipleEmailTemplate {
    message: String
    data: [EmailTemplate]
  }
  type EmailTemplateStatusCount {
    status: String
    count: Int
  }

  type EmailTemplateStatusCountSummary {
    message: String
    data: [EmailTemplateStatusCount]
  }

  extend type Mutation {
    createEmailTemplate(input: InputEmailTemplate!): SingleEmailTemplate
    updateEmailTemplate(id: Int!, input: InputEmailTemplate!): SingleEmailTemplate
    deleteEmailTemplate(id: Int!): SingleEmailTemplate
    sendSampleEmailTemplate(input: InputSendSampleEmailTemplate!): Message
    sendTestSms(input: InputSendTestSms): Message
    sendTestViberMessage(input: InputSendTestViverMessage): Message
    sendTestWhatsappMessage(input: InputSendTestSms): Message
    duplicateEmailTemplate(id: Int!, input: InputDuplicateEmailTemplate): SingleEmailTemplate
    approveEmailTemplate(id: Int!, approvedStatus: EmailTemplateApprovedStatus): SingleEmailTemplate
  }

  extend type Query {
    emailTemplates(
      after: String
      first: Int
      query: String
      before: String
      last: Int
      messagingPlatform: MessagingPlatformEnum
    ): PaginationMultipleEmailTemplate
    emailTemplate(id: Int!): SingleEmailTemplate
    emailTemplateStatusCountSummaries(fromDate: Date, toDate: Date): EmailTemplateStatusCountSummary
  }
`;
