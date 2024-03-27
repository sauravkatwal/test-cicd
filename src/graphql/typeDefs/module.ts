import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const moduleDefs: DocumentNode = gql`
  #graphql
  input InputModule {
    name: String!
    screenId: Int
  }

  type Module {
    id: Int
    name: String
    slug: String
    isDefault: Boolean
    screen: Screen
    privileges: [Privilege]
  }

  type SingleModule {
    message: String
    data: Module
  }

  type ModuleEdge {
    node: Module
    cursor: String
  }

  type PaginationMultipleModule {
    message: String
    edges: [ModuleEdge]
    pageInfo: PageInfo
  }

  extend type Mutation {
    createModule(input: InputModule!): SingleModule
    updateModule(id: Int!, input: InputModule!): SingleModule
    deleteModule(id: Int!): SingleModule
  }

  extend type Query {
    modules(first: Int, last: Int, after: String, before: String, query: String): PaginationMultipleModule
  }
`;
