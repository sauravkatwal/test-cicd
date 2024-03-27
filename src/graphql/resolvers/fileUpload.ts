import { createWriteStream, unlink } from 'node:fs';
import { InformationEvent } from 'http';
import { Guard } from '../../middlewares';
import { GraphQLUpload } from 'graphql-upload';
import { SuccessResponse } from '../../helpers';
import { ContextInterface, MultipleFilesInputInterface, SingleFileInputInterface } from '../../interfaces';
import { S3BucketHelper } from '../../utils';

export const fileUploadResolvers = {
  Upload: GraphQLUpload,
  Query: {},
  Mutation: {
    singleFileUpload: async (
      parent: ParentNode,
      args: SingleFileInputInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const { file } = args;
      const data = await S3BucketHelper.s3UploadSingleFile({ workspace: workspace.secret, file });
      return SuccessResponse.send({
        message: `File is uploaded successfully!!`,
        data: data,
      });
    },
    multipleFileUploads: async (
      parent: ParentNode,
      args: MultipleFilesInputInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      const { files } = args;
      const data = await S3BucketHelper.s3UploadMultipleFiles({ workspace: workspace.secret, files });
      const responseData = data.files.map((file) => {
        const { url, mimetype, size, filename } = file;
        return { url, mimetype, size, filename };
      });

      return SuccessResponse.send({
        message: `Files are uploaded successfully!!`,
        data: responseData,
      });
    },
  },
};
