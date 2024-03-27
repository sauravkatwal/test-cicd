import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const emailRegistryDefs : DocumentNode = gql`#graphql
    input InputEmailRegistry {
        name: String
        email: String
        phoneNumber: String
        description: String
        genderId: Int
        dob: String
        nationalityId: Int
        provinceId: Int
        districtId: Int
        municipality: String
        ward: Int
        profession: String
        emailRegistryGroupIds: [Int]
        emailRegistryGroupId: Int
    }

    input InputImportEmailRegistry {
        name: String
        email: String
        phoneNumber: String
        description: String
        gender: String
        dob: String
        nationality: String
        province: String
        district: String
        genderId: Int
        nationalityId: Int
        provinceId: Int
        districtId: Int
        municipality: String
        ward: Int
        profession: String
        groupLabel: String
        emailRegistryGroupIds: [Int]
        emailRegistryGroupId: Int
    }

    input InputEmailRegistriesWithEmailRegistryGroupId {
        emailRegistryGroupId: Int
        emailRegistryIds: [Int]
        emailRegistries: [InputImportEmailRegistry]
        sanitize: Boolean
    }

    enum EmailRegistryStatusEnum {
        sanitized
        unsanitized
        inprogress
    }

    enum EmailRegistrySanitizedStatusEnum {
        deliverable
        risky
        undeliverable
        unknown
    }

    enum EmailRegistrySanitizedReasonEnum {
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

    type EmailRegistry {
        id: Int
        name: String
        email: String
        emailVerified: Boolean
        phoneNumber: String
        phoneNumberVerified: Boolean
        description: String
        status: EmailRegistryStatusEnum
        sanitizedStatus: EmailRegistrySanitizedStatusEnum
        sanitizedReason: EmailRegistrySanitizedReasonEnum
        genderId: Int
        dob: String
        nationalityId: Int
        provinceId: Int
        districtId: Int
        municipality: String
        ward: Int
        profession: String
        sanitizedDate: Date
    }
 
    type EmailRegistriesCount {
        sanitized: Int
        unsanitized: Int
        deliverable:Int
        undeliverable:Int
        total: Int
    }
     
    type EmailRegistriesCountSummery{
        message: String
        data: EmailRegistriesCount
    
    }
    type EmailRegistryEdge {
        node: EmailRegistry
        cursor: String
    }

   type EmailRegistryList {
        message: String
        edges: [EmailRegistryEdge]
        pageInfo: PageInfo
    }

    type EmailRegistryListFromGroup {
        message: String
        edges: [EmailRegistryEdge]
        pageInfo: PageInfo
    }

    type SingleEmailRegistry {
        message: String
        data: EmailRegistry
    }

    type MultipleEmailRegistry {
        message: String
        data: [EmailRegistry]
    }

    type MultipleEmailRegistrySanitizedData {
        emailRegistries: [EmailRegistry]
        report: EmailRegistrySanitizedStatus
    }

    type MultipleEmailRegistrySanitized {
        message: String
        data: MultipleEmailRegistrySanitizedData
    }

    type  PaginationEmailRegistry {
        message: String
        data: [EmailRegistry]
        count: Int
    }

    type EmailRegistrySanitizedStatus {
        deliverable: Int
        risky: Int
        undeliverable: Int
        unknown: Int
    }

    type VerifyEmailRegistry {
        message: String
        data: EmailRegistrySanitizedStatus
    }

    extend type Mutation {
        createEmailRegistry(input: InputEmailRegistry!, sanitize: Boolean): SingleEmailRegistry
        updateEmailRegistry(id: Int!, input: InputEmailRegistry!, sanitize: Boolean): SingleEmailRegistry
        deleteEmailRegistry(id: Int!): SingleEmailRegistry
        verifyEmailRegistries(ids: [Int!]): VerifyEmailRegistry
        verifyEmailRegistry(id: Int!): VerifyEmailRegistry
        createEmailRegistries(input: [InputImportEmailRegistry]!, sanitize: Boolean): MultipleEmailRegistry
        createEmailRegistriesWithEmailRegistryGroup(input: InputEmailRegistriesWithEmailRegistryGroupId!): MultipleEmailRegistrySanitized
    }

    extend type Query {
        emailRegistries(first: Int, last: Int, after: String, before: String, query:String, emailRegistryGroupId: Int, status: EmailRegistryStatusEnum, sanitizedStatus: EmailRegistrySanitizedStatusEnum ): EmailRegistryList
        emailRegistriesFromGroup(first: Int, last: Int, after: String, before: String, query:String, emailRegistryGroupId: Int, status: EmailRegistryStatusEnum, sanitizedStatus: EmailRegistrySanitizedStatusEnum ): EmailRegistryListFromGroup
        emailRegistry(id: Int!): SingleEmailRegistry
        emailRegistriesCountSummaries(fromDate: Date, toDate: Date):EmailRegistriesCountSummery
    }
    type Subscription {
        sanitizationEmailRegistries: Scalar
    } 
`;
