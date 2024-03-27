import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const defaultEmailTemplateDefs : DocumentNode = gql`#graphql
    
   
    input InputDefaultEmailTemplate {
        name: String
        messagingPlatform: MessagingPlatformEnum
        content: Scalar
        content_html: Scalar
        description: String
     
    }

    type DefaultEmailTemplate {
        id: Int
        name: String
        messagingPlatform: MessagingPlatformEnum
        content: Scalar
        content_html: Scalar
        created_at: Date
        updated_at: Date
        description: String
        status: String
    }

    type SingleDefaultEmailTemplate{
        message: String
        data: DefaultEmailTemplate
    }

    type MultipleDefaultEmailTemplate{
        message: String
        data: [DefaultEmailTemplate]
    }

    type PaginationMultipleDefaultEmailTemplate{
        message: String
        data: [DefaultEmailTemplate]
        count: Int
    }

    extend type Mutation{
        createDefaultEmailTemplate(input: InputDefaultEmailTemplate!): SingleDefaultEmailTemplate
        updateDefaultEmailTemplate(id: Int!, input: InputDefaultEmailTemplate!): SingleDefaultEmailTemplate
        deleteDefaultEmailTemplate(id: Int!): SingleDefaultEmailTemplate
    }

    extend type Query{
        defaultEmailTemplates(offset: Int, limit: Int, query: String, sort: SortEnum, order: String,messagingPlatform: MessagingPlatformEnum): PaginationMultipleDefaultEmailTemplate
        defaultEmailTemplate(id:Int!): SingleDefaultEmailTemplate
    }
`;
