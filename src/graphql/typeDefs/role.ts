import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const roleDefs : DocumentNode = gql`#graphql
    input InputRole {
        label: String
        level: Int
    }

    enum RoleEnum {
        owner
        checker 
        maker
        member
    }

    type UserRole {
        role: Role
    }

    type Role {
        id: Int
        label: String
        slug: String
        level: Int
        created_at: Date
        roleMaps: [ScreenRoleMapping]
    }

    type RoleEdge {
        node: Role
        cursor: String
    }

    type PageInfo {
        startCursor: String
        endCursor: String
        hasNextPage: Boolean
        hasPreviousPage: Boolean
        count: Int
    }

    type MultipleRole {
        message: String
        data: [RoleEdge]
        pageInfo: PageInfo
    }

    type SingleRole {
        message: String
        data: Role
    }

    extend type Mutation {
        createRole(input: InputRole!): SingleRole
        updateRole(id: Int!, input: InputRole!): SingleRole
        deleteRole(id: Int!): SingleRole
    }

    extend type Query {
        roles(after: String, first: Int, before: String, last: Int, query: String): MultipleRole
        role(id: Int!): SingleRole
    }
`;
