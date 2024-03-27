import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const screenRoleMappingDefs: DocumentNode = gql`
  #graphql
  type SingleScreenRoleMappingInterface {
    message: String
  }

  type ScreenRoleMapping {
    id: Int
    roleId: Int
    isDefault: Boolean
    isPublished: Boolean
    isActive: Boolean
    screen: Screen
    module: Module
    privilege: Privilege
    role: Role
  }

  type MultipleScreenRoleMappings {
    message: String
    edges: [ScreenRoleMapping]
  }
  
  type ScreenRoleMappingEdge {
    node: ScreenRoleMapping
    cursor: String
  }

  type PaginationMultipleScreenRoleMapping {
    message: String
    edges: [ScreenRoleMappingEdge]
    pageInfo: PageInfo
  }

  extend type Mutation {
    createInputScreenRoleMapping(roleId: Int!, input: String!): SingleScreenRoleMappingInterface
    createMultipleInputScreenRoleMapping(roleId: Int!, input: [String!]!): SingleScreenRoleMappingInterface
    updateScreenRoleMapping(roleId: Int!, input: [String!]!): SingleScreenRoleMappingInterface
  }

  extend type Query {
    screenRoleMappings(
      first: Int
      last: Int
      after: String
      before: String
      query: String
      roleId: Int
    ): PaginationMultipleScreenRoleMapping
  }
`;
