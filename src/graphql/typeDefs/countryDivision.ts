import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const countryDivisionDefs: DocumentNode = gql` #graphql

    
  enum CountryDivisionTypeEnum {
        country
        state
        district
    }

    type CountryDivision {
        id: Int
        name: String
        slug: String
        country: Int
        state_id: Int
        district: String
        is_default: Boolean
        type: CountryDivisionTypeEnum
    }


    type SingleCountryDivision {
        message: String
        data: CountryDivision
    }

    type MultipleCountryDivision {
        message: String
        data: [CountryDivision]
    }

    type PaginationMultipleCountryDivision {
        message: String
        data: [CountryDivision]
        count: Int
    }
    

  extend type Query {
    countryDivisions(offset: Int, limit: Int, query: String, sort: SortEnum, order: String, type: CountryDivisionTypeEnum, state: String, country: String): PaginationMultipleCountryDivision
    countryDivision(id:Int!): SingleCountryDivision
    }
`;
