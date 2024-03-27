import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const workspaceDefs: DocumentNode = gql`
  #graphql
  type Workspace {
    id: Int
    label: String
    secret: String
    owner_id: Int
    company: Company
    pointOfContact: PointOfContact
    owner: User
    services: [Services]
  }

  type Services {
    service: ServiceEnum
    availableBalance: Int
    serviceRate: Int
  }

  input InputRegisterAdminWorkspace {
    name: String!
    email: String!
    phone_number: String!
    companyInfo: InputCompany!
    pointOfContact: InputPointOfContact!
    services: [InputTransaction]
  }

  type UserWorkspace {
    status: UserWorkspaceStatusEnum
    workspace: Workspace
    user_roles: [UserRole]
    user: User
  }
  type UserWorkspaceStatusCount {
    status: String
    count: Int
  }
  type UserWorkspaceStatusCountSummery {
    message: String
    data: [UserWorkspaceStatusCount]
  }

  type BalanceData {
    availableBalance: Int
    currentBalance: Int
  }

  type WorkspaceCredits {
    message: String
    data: BalanceData
  }

  type WorkspaceReport {
    message: String
    data: Scalar
  }

  extend type Mutation {
    adminRegisterWorkspace(input: InputRegisterAdminWorkspace!): Message
    adminAddCreditToWorkspace(workspaceId: Int!, input: [InputTransaction]): Message
    adminUpdateWorkspace(workspaceId: Int!, input: InputRegisterAdminWorkspace): Message
    adminDeleteWorkspace(id: Int!): Message
    adminSqlQueryTenant(sql: String!): Scalar
  }

  type WorkspaceEdge {
    node: Workspace
    cursor: String
  }

  type PaginationMultipleWorkspace {
    message: String
    edges: [WorkspaceEdge]
    pageInfo: PageInfo
  }

  type SingleWorkspace {
    message: String
    data: Workspace
  }

  extend type Query {
    adminWorkspaces(after: String, first: Int, query: String, before: String, last: Int): PaginationMultipleWorkspace
    adminWorkspace(id: Int!): SingleWorkspace
    userWorkspaceStatusCountSummaries(fromDate: Date, toDate: Date): UserWorkspaceStatusCountSummery
    workspaceCredits(service: ServiceEnum!): WorkspaceCredits
    adminCreditsUsageSummary(workspaceId: Int!, fromDate: Date, toDate: Date): WorkspaceReport
    adminCreditsUsageDetails(workspaceId: Int!, fromDate: Date, toDate: Date, service: ServiceEnum): WorkspaceReport
    adminVerifyRegistrationInput(email: String, phoneNumber: String, companyName: String, companyRegNo: String): Message
    creditsUsageSummary(workspaceId: Int!, fromDate: Date, toDate: Date): WorkspaceReport
    creditsUsageDetails(workspaceId: Int!, fromDate: Date, toDate: Date, service: ServiceEnum): WorkspaceReport
  }
`;
