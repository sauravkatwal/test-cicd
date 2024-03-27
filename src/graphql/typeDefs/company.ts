import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const companyDefs : DocumentNode = gql`#graphql
    input InputCompany {
        name: String
        registration_number: String
        address: InputAddress
    }

    type Company {
        id: Int
        name: String
        registration_number: String
        address: Address
    }

    type SingleCompany {
        message: String
        data: Company
    }

    type MultipleCompany {
        message: String
        data: [Company]
    }

    extend type Mutation {
        createCompany(input: InputCompany!): SingleCompany
    }
`;
