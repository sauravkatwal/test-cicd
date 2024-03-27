import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const publishSanitizedMessageDefs: DocumentNode = gql`
  #graphql
  
  type SanitizationMessage {
    message: String
    data: Scalar
  }

  extend type Query {
    publishSanitizedMessage: SanitizationMessage
  }
`;