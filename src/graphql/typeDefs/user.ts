import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const userDefs : DocumentNode = gql`#graphql
    input InputUser {
        name: String
        email: String
        phone_number: String
        roles: [String]
    }

    input InputInviteWorkspaceMember {
        name: String!
        email: String!
        phone_number: String
        role: String!
    }

    input UpdateInviteWorkspaceMember {
        role: String
    }

    input InputResendInviteWorkspaceMember {
        email: String!
    }

    enum SortEnum {
        desc
        asc
    }

    type User {
        id: Int
        name: String
        email: String
        phone_number: String
        user_workspaces: [UserWorkspace]
    }

    enum UserWorkspaceStatusEnum {
        pending
        accepted
        declined
        expired
        deactivated
    }

    type SingleUser {
        message: String
        data: User
    }

    type MultipleUser {
        message: String
        data: [User]
    }

    type PaginationUser {
        message: String
        data: [User]
        count: Int
    }

    type Message {
        message: String
    }

    extend type Mutation {
        inviteWorkspaceMember(input: InputInviteWorkspaceMember!): Message
        updateWorkspaceMember(id: Int, input: UpdateInviteWorkspaceMember!): Message
        deactivateWorkspaceMember(id: Int): Message
        resendInviteWorkspaceMember(input: InputResendInviteWorkspaceMember!): Message
        deleteWorkspaceMember(id: Int!): Message
    }

    extend type Query {
        workspaceMembers(offset: Int, limit: Int, query: String, sort: SortEnum, order: String, status: UserWorkspaceStatusEnum): PaginationUser
    }
`;
