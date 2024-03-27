import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const attributeDefs: DocumentNode = gql`
  #graphql
  input InputAttribute {
    name: String!
    description: String
    is_active: Boolean
    is_default: Boolean
  }

  type Attribute {
    id: Int
    name: String
    description: String
    is_active: Boolean
    is_default: Boolean
  }

  type SingleAttribute {
    message: String
    data: Attribute
  }

  type MultipleAttribute {
    message: String
    data: [Attribute]
  }

  type PaginationAttribute {
    message: String
    data: [Attribute]
    count: Int
  }
  type Mutation {
    createAttribute(input: InputAttribute!): SingleAttribute
    updateAttribute(id: Int!, input: InputAttribute!): SingleAttribute
    deleteAttribute(id: Int!): SingleAttribute
  }

  type Query {
    attributes(offset: Int, limit: Int, query: String, sort: SortEnum, order: String): PaginationAttribute
    attribute(id: Int!): SingleAttribute
  }
`;
