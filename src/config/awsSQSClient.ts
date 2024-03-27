import https from 'https';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { SQS, SQSClient } from '@aws-sdk/client-sqs';

import { InputAWSSQSInterface } from '../interfaces';
import { KeyUtil } from '../utils';

export class AwsSQSClient {
  private sqsConnectionMap: Map<string, SQSClient> = new Map();

  constructor(private readonly input: InputAWSSQSInterface) {};

  public getSqsClient(): SQSClient {
    const { workspaceSecret, purpose, credentials } = this.input;
    const key = KeyUtil.sqsTenantConnectionKey({ workspaceSecret: workspaceSecret, sqsPurpose: purpose });
    if (!this.sqsConnectionMap.has(key)) {
      const agent = new https.Agent({
        maxSockets: 50,
      });
      this.sqsConnectionMap.set(
        key,
        new SQS({
          requestHandler: new NodeHttpHandler({
            httpsAgent: agent,
          }),
          region: credentials.region,
          credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
          },
        }),
      );
    }

    return this.sqsConnectionMap.get(key)!;
  }
}
