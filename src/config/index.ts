import * as dotenv from 'dotenv';
import * as sequelize from 'sequelize';
import { EnvironmentEnum, SortEnum } from '../enums';

dotenv.config();

const mustExist = <T>(value: T | undefined, name: string): T => {
  if (!value) {
    console.error(`Missing Config: ${name} !!!`);
    process.exit(1);
  }
  return value;
};

/**
 * Your favorite port
 */
export const port = parseInt(process.env.PORT!) as number,
  /**
   * Graphql schema
   */
  playground = (process.env.GRAPHIQL === 'true') as boolean,
  /**
   * Application mode (Set the environment to 'development' by default)
   */
  environment = process.env.ENVIRONMENT || (EnvironmentEnum.development as EnvironmentEnum),
  /**
   * Database Connection
   */
  db = {
    username: process.env.DB_USER! as string,
    password: process.env.DB_PASSWORD! as string,
    name: process.env.DB_NAME! as string,
    host: process.env.DB_HOST! as string,
    dialect: process.env.DB_DIALECT! as sequelize.Dialect,
    port: parseInt(process.env.DB_PORT!) as number,
    logging: false,
    timezone: 'utc' as string,
  },
  // AWS cognito
  cognito = {
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
    clientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID!,
    region: process.env.AWS_COGNITO_REGION!,
    accessKeyId: process.env.AWS_COGNITO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_COGNITO_SECRET_ACCESS_KEY!,
    responseTimeout: process.env.AWS_COGNITO_RESPONSE_TIMEOUT!
  } as {
    userPoolId: string;
    clientId: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    responseTimeout: string;
  },
  // Use bouncer
  bouncer = {
    baseUrl: process.env.BOUNCER_BASE_URL!,
    apiKey: process.env.BOUNCER_API_KEY!,
  } as { baseUrl: string; apiKey: string },
  // AWS SES
  ses = {
    region: process.env.AWS_SES_REGION!,
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
    configurationSetName: process.env.AWS_SES_CONFIGURATION_NAME,
  } as { region: string; accessKeyId: string; secretAccessKey: string; configurationSetName: string },
  //S3 Bucket
  s3Bucket = {
    awsS3BucketName: process.env.AWS_S3_BUCKET_NAME!,
    awsS3BucketRegion: process.env.AWS_S3_BUCKET_REGION!,
    awsS3BucketAccessKey: process.env.AWS_S3_BUCKET_ACCESS_KEY!,
    awsS3BucketAccessSecret: process.env.AWS_S3_BUCKET_ACCESS_SECRET!,
  } as {
    awsS3BucketName: string;
    awsS3BucketRegion: string;
    awsS3BucketAccessKey: string;
    awsS3BucketAccessSecret: string;
  },
  // Redis
  redisClient = {
    host: process.env.REDIS_HOST!,
    port: +process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD!,
  } as { host: string; port: number; password: string },
  // Whatsapp
  whatsapp = {
    baseUrl: process.env.WHATSAPP_BASE_URL!,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    versionNumber: process.env.WHATSAPP_VERSION!,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID!,
    applicationId: process.env.WHATSAPP_APP_ID!,
  } as {
    baseUrl: string;
    accessToken: string;
    phoneNumberId: string;
    versionNumber: string;
    businessAccountId: string;
    applicationId: string;
  },
  // SMS
  sms = {
    baseUrl: process.env.SPARROWSMS_BASE_URL!,
    accessToken: process.env.SPARROWSMS_ACCESS_TOKEN!,
    from: process.env.SPARROWSMS_FROM!,
  } as {
    baseUrl: string;
    accessToken: string;
    from: string;
  },
  // Viber
  viber = {
    baseUrl: process.env.SPARROWVIBER_BASE_URL!,
    accessToken: process.env.SPARROWVIBER_ACCESS_TOKEN!,
    partnerToken: process.env.SPARROWVIBER_PARTNER_TOKEN!,
    senderName: process.env.SPARROWVIBER_SENDER_NAME!,
  } as {
    baseUrl: string;
    accessToken: string;
    partnerToken: string;
    senderName: string;
  },
  // AWS SQS
  sqs = {
    queueUrl: process.env.AWS_SQS_CONFIGURATION_URL!,
    region: process.env.AWS_SQS_REGION!,
    accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY!,
  } as {
    queueUrl: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  },
  frontendHostBaseUrl = process.env.FRONTEND_HOST_BASE_URL! as string,
  encryption = {
    symmetricKey: mustExist(process.env.ENCRYPTION_SYMMETRIC_KEY, "ENCRYPTION_SYMMETRIC_KEY"),
    compressAlgorithm: mustExist(process.env.ENCRYPTION_COMPRESS_ALGORITHM, "ENCRYPTION_COMPRESS_ALGORITHM"),
    cipherAlgorithm: mustExist(process.env.ENCRYPTION_CIPHER_ALGORITHM, "ENCRYPTION_CIPHER_ALGORITHM"),
  },
  /** Pagination */
  pgMinLimit = 10,
  pgMaxLimit = 100,
  pgCampaignMaxLimit = 20,
  pgEmailRegistryGroupMaxLimit = 20,
  /**** Cursor */
  defaultCursor: string = 'id',
  // maxAfter = '2147483647', //  new Date().toISOString()
  // minBefore = '0', // new Date("1970-01-01Z00:00:00:000").toISOString()
  /** Order */
  defaultOrder = 'created_at',
  defaultSort = SortEnum.desc;

export * from './instance';
export * from './redis';
export * from './tenantDBInstance';
export * from './awsSQSClient';
