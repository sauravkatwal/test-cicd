import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const screenDefs: DocumentNode = gql`
  #graphql
  enum ScreenStatusEnum {
    active
    inactive
  }

  input InputScreen {
    name: String!
    status: ScreenStatusEnum
    description: String
  }

  type Screen {
    id: Int
    name: String
    slug: String
    isDefault: Boolean
    status: ScreenStatusEnum
    description: String
    modules: [Module]
  }

  type SingleScreen {
    message: String
    data: Screen
  }

  type ScreenEdge {
    node: Screen
    cursor: String
  }

  type PaginationMultipleScreen {
    message: String
    edges: [ScreenEdge]
    pageInfo: PageInfo
  }


  extend type Mutation {
    createScreen(input: InputScreen!): SingleScreen
    updateScreen(id: Int!, input: InputScreen!): SingleScreen
    deleteScreen(id: Int!): SingleScreen
  }

  extend type Query {
    screens(first: Int, last: Int, after: String, before: String, query: String): PaginationMultipleScreen
    screen(id: Int!): SingleScreen
  }
`;
