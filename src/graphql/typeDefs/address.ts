import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const addressDefs: DocumentNode = gql`
  #graphql
  input InputAddress {
    street: String
    suburb: String
    state: String
    country: String
    postalCode: String
  }

  type Address {
    id: Int
    street: String
    suburb: String
    state: String
    country: String
    postalCode: String
    company_id: Int
  }
`;
