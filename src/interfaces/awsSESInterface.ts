export interface InputAwsSESInterface {
  from?: string;
  destination: string[];
  subject: string;
  content: string;
  reply_to_addresses?: string[];
  configurationSetName?: boolean;
  attachments?: any[];
}
