import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { streamToBuffer } from '@jorgeferrero/stream-to-buffer';
import KSUID from 'ksuid';
import { s3Bucket } from '../config';
import { MultipleFilesUploadInterface, SingleFileUploadInterface } from '../interfaces';

class S3BucketHelper {
  private static instance: S3BucketHelper;
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: s3Bucket.awsS3BucketRegion,
      credentials: {
        accessKeyId: s3Bucket.awsS3BucketAccessKey,
        secretAccessKey: s3Bucket.awsS3BucketAccessSecret,
      },
    });
  }

  static get(): S3BucketHelper {
    if (!S3BucketHelper.instance) {
      S3BucketHelper.instance = new S3BucketHelper();
    }
    return S3BucketHelper.instance;
  }

  s3UploadSingleFile = async ({
    workspace,
    file,
  }: {
    workspace: string;
    file: any;
  }): Promise<SingleFileUploadInterface> => {
    try {
      const { filename, createReadStream, mimetype } = await file;
      const rs = await createReadStream();
      const fileContent = await streamToBuffer(rs);
      const newFileName = `${KSUID.randomSync().string}-${filename.replace(/\s+/g, '_')}`;
      const fileExtension = filename.split('.')[1];
      const imageExtensions = [
        'jpg',
        'jpeg',
        'jpe',
        'jif',
        'jfif',
        'jfi',
        'png',
        'gif',
        'bmp',
        'tiff',
        'tif',
        'webp',
        'svg',
        'ico',
      ];
      const params = {
        Bucket: s3Bucket.awsS3BucketName,
        Key: `${workspace}/${newFileName}`,
        Body: fileContent,
        ContentType: imageExtensions.includes(fileExtension) ? 'image/jpeg' : 'application/octet-stream',
        ACL: 'public-read',
      } as PutObjectCommandInput;

      const object = await this.s3Client.send(new PutObjectCommand(params));

      const url = ` https://s3.${s3Bucket.awsS3BucketRegion}.amazonaws.com/${s3Bucket.awsS3BucketName}/${params.Key}`;
      return { url, mimetype, size: fileContent.length, filename: newFileName };
    } catch (error: any) {
      console.error(error);
      throw new Error('Error uploading file');
    }
  };

  s3UploadMultipleFiles = async ({
    workspace,
    files,
  }: {
    workspace: string;
    files: any[];
  }): Promise<MultipleFilesUploadInterface> => {
    try {
      const promises: Promise<SingleFileUploadInterface>[] = [];
      for (const file of files) {
        const { filename, createReadStream, mimetype } = await file;
        const rs = await createReadStream();
        const fileContent = await streamToBuffer(rs);
        const newFileName = `${KSUID.randomSync().string}-${filename.replace(/\s+/g, '_')}`;
        const fileExtension = filename.split('.')[1];
        const imageExtensions = [
          'jpg',
          'jpeg',
          'jpe',
          'jif',
          'jfif',
          'jfi',
          'png',
          'gif',
          'bmp',
          'tiff',
          'tif',
          'webp',
          'svg',
          'ico',
        ];
        const params = {
          Bucket: s3Bucket.awsS3BucketName,
          Key: `${workspace}/${newFileName}`,
          Body: fileContent,
          ContentType: imageExtensions.includes(fileExtension) ? 'image/jpeg' : 'application/octet-stream',
          ACL: 'public-read',
        } as PutObjectCommandInput;
        await this.s3Client.send(new PutObjectCommand(params));

        const url = `https://${s3Bucket.awsS3BucketName}.s3.${s3Bucket.awsS3BucketRegion}.amazonaws.com/${workspace}/${newFileName}`;
        const MimeType = mimetype;
        promises.push(Promise.resolve({ url, mimetype: MimeType, size: fileContent.length, filename: newFileName }));
      }

      const result = await Promise.all(promises);

      return { files: result };
    } catch (error: any) {
      throw new Error('Error uploading files');
    }
  };
}

const s3BucketHelper = S3BucketHelper.get();

export { s3BucketHelper as S3BucketHelper };
