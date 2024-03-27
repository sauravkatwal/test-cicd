import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const attributeValueDefs: DocumentNode = gql`
  #graphql
  enum AtributeNameEnum {
    gender
    nationality
  }

  input InputAttributeValue {
    value: String!
    description: String
    isActive: Boolean
    isDefault: Boolean
    attributeId: Int!
  }

  type AttributeValue {
    id: Int
    value: String
    description: String
    isActive: Boolean
    isDefault: Boolean
    attributeId: Int!
  }

  type SingleAttributeValue {
    message: String
    data: AttributeValue
  }

  type MultipleAttributeValue {
    message: String
    data: [AttributeValue]
  }

  type PaginationAttributeValue {
    message: String
    data: [AttributeValue]
    count: Int
  }

  extend type Mutation {
    createAttributeValue(input: InputAttributeValue!): SingleAttributeValue
    updateAttributeValue(id: Int!, input: InputAttributeValue!): SingleAttributeValue
    deleteAttributeValue(id: Int!): SingleAttributeValue
  }

  extend type Query {
    attributeValues(
      offset: Int
      limit: Int
      query: String
      sort: SortEnum
      order: String
      attributeId: Int
      attributeName: AtributeNameEnum
    ): PaginationAttributeValue
    attributeValue(id: Int!): SingleAttributeValue
  }
`;
