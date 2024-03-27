import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const sparrowSmsCreddentialDefs: DocumentNode = gql`
  #graphql
  type SparrowSmsCredential {
    id: Int
    from: String
  }

  type SingleSparrowSmsCredential {
    message: String
    data: SparrowSmsCredential
  }

  extend type Query {
    sparrowSmsCreddential: SingleSparrowSmsCredential
  }
`;
