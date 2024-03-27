import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const userWorkspaceDefs: DocumentNode = gql`
  #graphql


  type UserWorkspaceRoleCountSummary {
    message: String
    data: Scalar
  }

  type UserWorkspaceRole {
    id: Int
    user_workspace_id: Int
    roleId: Int
    role: Role
  }

  type SingleUserWorkspace {
    message: String
    edges: UserWorkspaceRole
  }

  type Query {
    userWorkspaceRoleCountSummaries(fromDate: Date, toDate: Date): UserWorkspaceRoleCountSummary
  }
`;
