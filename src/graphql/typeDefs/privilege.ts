import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const privilegeDefs: DocumentNode = gql`
  #graphql
  enum PrivilegeEnum {
    mutation
    query
    subscription
  }

  input InputPrivilege {
    name: String!
    moduleId: Int
    description: String
  }

  type Privilege {
    id: Int
    name: String
    slug: String
    isDefault: Boolean
    module: Module
    description: String
  }

  type SinglePrivilege {
    message: String
    data: Privilege
  }

  type PrivilegeEdge {
    node: Privilege
    cursor: String
  }

  type PaginationMultiplePrivilege{
    message: String
    edges: [PrivilegeEdge]
    pageInfo: PageInfo
  }

  extend type Mutation {
    createPrivilege(input: InputPrivilege!): SinglePrivilege
    updatePrivilege(id: Int!, input: InputPrivilege!): SinglePrivilege
    deletePrivilege(id: Int!): SinglePrivilege
  }

  extend type Query {
    privileges(first: Int, last: Int, after: String, before: String, query: String): PaginationMultiplePrivilege
    privilege(id: Int!): SinglePrivilege
  }
`;
