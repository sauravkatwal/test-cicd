import gql from 'graphql-tag';

import { DocumentNode } from 'graphql';

export const fileUploadDefs: DocumentNode = gql`
  #graphql
  scalar Upload

  type SingleFile {
    message: String!
    data: File!
  }

  type MultipleFile {
    message: String!
    data: [File!]!
  }

  type File {
    filename: String!
    url: String!
    mimetype: String!
    size: Int!
  }

  extend type Mutation {
    singleFileUpload(file: Upload!): SingleFile!
    multipleFileUploads(files: [Upload]): MultipleFile!
  }
`;
