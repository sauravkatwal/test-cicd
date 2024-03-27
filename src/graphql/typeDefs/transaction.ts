import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const transactionDefs: DocumentNode = gql`
  #graphql
  enum ServiceEnum {
    bouncer
    email
    sms
    viber
    whatsapp
  }

  input InputTransaction {
    service: ServiceEnum!
    credit: Int
    serviceRate: Int
  }

`;
