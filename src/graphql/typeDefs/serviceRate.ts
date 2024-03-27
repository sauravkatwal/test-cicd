import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const serviceRateDefs: DocumentNode = gql`
  #graphql
  input InputServiceRate {
    service: ServiceEnum!
    creditUnit: Int
    amount: Int!
  }

  type ServiceRate {
    id: Int
    service: ServiceEnum
    creditUnit: Int
    amount: Int
  }

  type ServiceRateEdge {
    node: ServiceRate
    cursor: String
  }

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    count: Int
  }

  type MultipleServiceRate {
    message: String
    data: [ServiceRateEdge]
    pageInfo: PageInfo
  }

  type SingleServiceRate {
    message: String
    data: ServiceRate
  }

  extend type Mutation {
    adminCreateServiceRate(input: InputServiceRate!): SingleServiceRate
    adminUpdateServiceRate(id: Int!, input: InputServiceRate!): SingleServiceRate
    adminDeleteServiceRate(id: Int!): SingleServiceRate
  }

  extend type Query {
    adminServiceRates(after: String, first: Int, before: String, last: Int, query: String, workspaceId: Int, service: ServiceEnum): MultipleServiceRate
  }
`;
