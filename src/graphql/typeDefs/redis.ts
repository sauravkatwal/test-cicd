import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const redisDefs : DocumentNode = gql`#graphql
    input InputCreateCache {
        module: String
        data: Scalar
    }

    input InputGetCache {
        module: String
    }

    type CacheResponse {
        message: String
        data: Scalar
    }

    extend type Mutation {
        createCache(input: InputCreateCache!): CacheResponse
        removeCache(input: InputGetCache!): CacheResponse
    }

    extend type Query {
        getCache(input: InputGetCache!): CacheResponse
    }

`;
