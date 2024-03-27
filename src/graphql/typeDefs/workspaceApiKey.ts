import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const workspaceApiKeyDefs: DocumentNode = gql`
  #graphql

input InputWorkspaceApiKey {
  enable: Boolean
}

type PaginationMultipleWorkspaceApiKeys {
  message: String
  pageInfo: PageInfo
}

  extend type Mutation {
    createWorkspaceApiKey(input: InputWorkspaceApiKey): Message
    updateWorkspaceApiKey(id: Int!, input: InputWorkspaceApiKey): Message
    deleteWorkspaceApiKey(id: Int!): Message
  }

  extend type Query {
    workspaceApiKeys(
      after: String
      first: Int
      query: String
      before: String
      last: Int
      enable: Boolean
    ): PaginationMultipleWorkspaceApiKeys
  }
`;
