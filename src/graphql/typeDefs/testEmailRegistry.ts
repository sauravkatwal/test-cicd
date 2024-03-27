import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const testEmailRegistryDefs : DocumentNode = gql`#graphql
    input InputTestEmailRegistry {
        name: String
        email: String
        phoneNumber: String
        description: String
        emailRegistryGroupIds: [Int]
        emailRegistryGroupId: Int
    }

    input InputTestEmailRegistriesWithEmailRegistryGroupId {
        emailRegistryGroupId: Int
        emailRegistryIds: [Int]
        emailRegistries: [InputTestEmailRegistry]
        sanitize: Boolean
    }

    enum TestEmailRegistryStatusEnum {
        sanitized
        unsanitized
    }

    enum TestEmailRegistrySanitizedStatusEnum {
        deliverable
        risky
        undeliverable
        unknown
    }

    enum TestEmailRegistrySanitizedReasonEnum {
        accepted_email
        low_deliverability
        low_quality
        invalid_email
        invalid_domain
        rejected_email
        dns_error
        unavailable_smtp
        unknown
    }

    type TestEmailRegistry {
        id: Int
        name: String
        email: String
        emailVerified: Boolean
        phoneNumber: String
        phoneNumberVerified: Boolean
        description: String
        status: TestEmailRegistryStatusEnum
        sanitizedStatus: TestEmailRegistrySanitizedStatusEnum
        sanitizedReason: TestEmailRegistrySanitizedReasonEnum
    }
 
    type TestEmailRegistriesCount {
        sanitized: Int
        unsanitized: Int
        deliverable:Int
        undeliverable:Int
        total: Int
    }
     
    type TestEmailRegistriesCountSummery{
        message: String
        data: TestEmailRegistriesCount
    
    }
    type TestEmailRegistryEdge {
        node: TestEmailRegistry
        cursor: String
    }

   type TestEmailRegistryList {
        message: String
        edges: [TestEmailRegistryEdge]
        pageInfo: PageInfo
    }
    type SingleTestEmailRegistry {
        message: String
        data: TestEmailRegistry
    }

    type MultipleTestEmailRegistry {
        message: String
        data: [TestEmailRegistry]
    }

    type MultipleTestEmailRegistrySanitizedData {
        emailRegistries: [TestEmailRegistry]
        report: TestEmailRegistrySanitizedStatus
    }

    type MultipleTestEmailRegistrySanitized {
        message: String
        data: MultipleTestEmailRegistrySanitizedData
    }

    type  PaginationTestEmailRegistry {
        message: String
        data: [TestEmailRegistry]
        count: Int
    }

    type TestEmailRegistrySanitizedStatus {
        deliverable: Int
        risky: Int
        undeliverable: Int
        unknown: Int
    }

    type VerifyTestEmailRegistry {
        message: String
        data: TestEmailRegistrySanitizedStatus
    }

    extend type Mutation {
        createTestEmailRegistry(input: InputTestEmailRegistry!): SingleTestEmailRegistry
        updateTestEmailRegistry(id: Int!, input: InputTestEmailRegistry!): SingleTestEmailRegistry
        deleteTestEmailRegistry(id: Int!): SingleTestEmailRegistry
        VerifyTestEmailRegistry(id: Int!): VerifyTestEmailRegistry
    }

    extend type Query {
        testEmailRegistries(first: Int, last: Int, after: String, before: String, query:String, emailRegistryGroupId: Int, status: TestEmailRegistryStatusEnum, sanitizedStatus: TestEmailRegistrySanitizedStatusEnum ): TestEmailRegistryList
        testEmailRegistry(id: Int!): SingleTestEmailRegistry
    }
`;
