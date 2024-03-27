export interface SingleFileInputInterface {
  file: Promise<{
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => NodeJS.ReadableStream;
  }>;
}

export interface SingleFileUploadInterface {
  url: string;
  mimetype: string;
  size: number;
  filename: string;
}

export interface MultipleFilesInputInterface {
  files: Promise<{
    filename: string;
    createReadStream: () => NodeJS.ReadableStream;
  }>[];
}

export interface MultipleFilesUploadInterface {
  files: SingleFileUploadInterface[];
}
