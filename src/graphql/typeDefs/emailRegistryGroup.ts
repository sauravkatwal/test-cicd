import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const emailRegistryGroupDefs: DocumentNode = gql`
  #graphql

  scalar CsvData

  input InputAge {
    from: Int
    to: Int
  }

  input InputFilterCriteria {
    age: InputAge
    gender: String
    province: String
    district: String
    nationality: String
  }

  input InputEmailGroupRegistry {
    label: String
    status: EmailRegistryGroupStatusEnum
    type: EmailRegistryGroupTypesEnum
    emailRegistries: [Int]
    sanitize: Boolean
    isExistingCriteria: Boolean
    filterCriteria: InputFilterCriteria
    csvData: CsvData
    description: String
  }

  input InputEmailGroupRegistryWithEmailRegistries {
    label: String
    status: EmailRegistryGroupStatusEnum
    type: EmailRegistryGroupTypesEnum
    sanitize: Boolean
    emailRegistries: [InputEmailRegistryForGroup!]!
  }

  input InputEmailRegistryForGroup {
    name: String
    email: String
    phoneNumber: String
    description: String
  }

  enum EmailRegistryGroupStatusEnum {
    active
    inactive
  }

  enum EmailRegistryGroupTypesEnum {
    email
    message
  }

  type EmailRegistryGroup {
    id: Int
    label: String
    slug: String
    status: EmailRegistryGroupStatusEnum
    type: EmailRegistryGroupTypesEnum
    emailRegistryCount: Int
    summary: Scalar
    createdAt: Date
    updatedAt: Date
    description: String
    groupCode: String
  }

  type EmailRegistryGroupCount {
    status: String
    count: Int
  }

  type EmailRegistryGroupCountSummery {
    message: String
    data: [EmailRegistryGroupCount]
  }

  type EmailRegistryGroupEdge {
    node: EmailRegistryGroup
    cursor: String
  }

  type EmailRegistryGroupList {
    message: String
    edges: [EmailRegistryGroupEdge]
    pageInfo: PageInfo
  }

  type SingleEmailRegistryGroup {
    message: String
    data: EmailRegistryGroup
  }

  type MultipleEmailRegistryGroup {
    message: String
    data: [EmailRegistryGroup]
  }

  extend type Mutation {
    createEmailRegistryGroup(input: InputEmailGroupRegistry!): VerifyEmailRegistry
    updateEmailRegistryGroup(id: Int!, input: InputEmailGroupRegistry!): SingleEmailRegistryGroup
    deleteEmailRegistryGroup(id: Int!): SingleEmailRegistryGroup
    createEmailRegistryGroupWithEmailRegistries(input: InputEmailGroupRegistryWithEmailRegistries!): VerifyEmailRegistry
  }

  extend type Query {
    emailRegistryGroups(
      first: Int
      last: Int
      after: String
      before: String
      query: String
      status: EmailRegistryGroupStatusEnum
      type: EmailRegistryGroupTypesEnum
    ): EmailRegistryGroupList
    emailRegistryGroup(id: Int!): SingleEmailRegistryGroup
    emailRegistryGroupStatusSummaries(fromDate: Date, toDate: Date): EmailRegistryGroupCountSummery
    emailRegistryGroupCountSummaries(fromDate: Date, toDate: Date): EmailRegistryGroupCountSummery
  }
`;
