import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const pointOfContactDefs: DocumentNode = gql`
  #graphql
  input InputPointOfContact {
    firstName: String!
    lastName: String!
    email: String!
    jobTitle: String!
    jobPosition: String!
    phoneNumber: String!
  }

  type PointOfContact {
    id: Int
    firstName: String!
    lastName: String!
    email: String!
    jobTitle: String!
    jobPosition: String!
    phoneNumber: String!
  }
`;
