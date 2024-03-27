export interface AWSSecretInterface {
  awsSesRegion?: string;
  awsSesAccessKeyId?: string;
  awsSesAccessKeySecret?: string;
  awsSesConfigurationName?: string;
}

export interface SparrowSmsSecretInterface {
  sparrowSmsBaseUrl?: string;
  sparrorSmsAccessToken?: string;
  sparrowSmsFrom?: string;
}

export interface SparrowViberSecretInterface {
  sparrowViberApiToken?: string;
  sparrowViberPartnerToken?: string;
  sparrowViberSenderName?: string;
}
