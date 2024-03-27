import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const emailRegistryEmailRegistryGroupDefs : DocumentNode = gql`#graphql
    input InputEmailRegistryEmailRegistryGroup {
        emailRegistryId: Int
        emailRegistryGroupId: Int
    }

    extend type Mutation {
        addEmailRegistryEmailRegistryGroup(input: InputEmailRegistryEmailRegistryGroup!): Message
        removeEmailRegistryEmailRegistryGroup(input: InputEmailRegistryEmailRegistryGroup!): Message
    }
`;
