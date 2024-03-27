import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const awsSesClientIdentityDefs : DocumentNode = gql`#graphql
   enum IdentityType {
        Domain 
        EmailAddress
    }

    enum AWSSesStatus {
        success
        failed
        pending
        temporaryFailure
        notStarted
    }

    input InputAWSSesClientIdentity {
       identity: String!
       type: IdentityType!
    }

    type AWSSesClientIdentity {
        id: Int
        type: IdentityType
        identity: String
        status: String
        workspaceId: String
        createdAt: Date
        updatedAt: Date
    }

    type AWSSesClientIdentityEdge {
        node: AWSSesClientIdentity
        cursor: String
    }

    type AwsSesClientIdentityList {
        message: String
        data: [AWSSesClientIdentityEdge]
        pageInfo: PageInfo
    }

    type SingleAWSSesClientIdentity  {
        message: String
        data: AWSSesClientIdentity
    }

    type MultipleAWSSesClientIdentity {
        message: String 
        data: [AWSSesClientIdentity]
        count: Int
    }

    extend type Mutation {
        createAwsSesClientIdentity(input:InputAWSSesClientIdentity! ): SingleAWSSesClientIdentity
        deleteAwsSesClientIdentity(id: Int! ): SingleAWSSesClientIdentity
        resendVerifyLinkAwsSesClientIdentity(id: Int! ): SingleAWSSesClientIdentity
    }

    extend type Query {
        listIdentities(first: Int, last: Int, after: String, before: String, status: AWSSesStatus, updateBeforeFetch: Boolean): AwsSesClientIdentityList
        listIdentity(input: InputAWSSesClientIdentity): SingleAWSSesClientIdentity
    }
`;