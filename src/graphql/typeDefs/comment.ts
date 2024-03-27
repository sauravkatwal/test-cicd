import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const commentDefs: DocumentNode = gql`
  #graphql
  input InputComment {
    campaignId: Int
    emailTemplateId: Int
    comment: String
  }

  type Comment {
    id: Int
    campaignId: Int
    emailTemplateId: Int
    comment: String
    userWorkspace: UserWorkspace
  }

  type CommentEdge {
    node: Comment
    cursor: String
  }

  type CommentList {
    message: String
    edges: [CommentEdge]
    pageInfo: PageInfo
  }

  type CommentEdgeFormatted {
    name: String
    email: String
    date: String
    comments: [String]
  }

  type CommentListFormatted {
    message: String
    edges: [CommentEdgeFormatted]
  }

  type SingleComment {
    message: String
    data: Comment
  }

  extend type Mutation {
    createComment(input: InputComment): SingleComment
  }

  extend type Query {
    comments(first: Int, last: Int, after: String, before: String, campaignId: Int, emailTemplateId: Int): CommentListFormatted
    comment(id: Int!): SingleComment
  }
`;
