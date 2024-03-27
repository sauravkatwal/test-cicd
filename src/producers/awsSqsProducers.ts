import { SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import { InputCBSEmailRegistryInterface } from '../interfaces';
import { Ksuid } from '../helpers';

import { AwsSQSClient } from '../config/awsSQSClient';

export class SQSProducer {
  constructor() {}

  async publishEmailRegistryBatch({
    messages,
    queueUrl,
    sqsClient,
  }: {
    messages: InputCBSEmailRegistryInterface[];
    queueUrl: string;
    sqsClient: AwsSQSClient;
  }) {
    try {
      const uniqueId = Ksuid.randomSync();
      const sendMessageBatchCommand = new SendMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: messages.map((input, index) => ({
          Id: index.toString(),
          MessageGroupId: `${input.workspaceId}-${uniqueId}`,
          MessageDeduplicationId: `${index.toString()}-${uniqueId}`,
          MessageAttributes: {
            workspaceId: {
              DataType: 'String',
              StringValue: input.workspaceId!.toString(),
            },
            sanitize: {
              DataType: 'String',
              StringValue: input.sanitize ? input.sanitize.toString() : 'false',
            },
            name: {
              DataType: 'String',
              StringValue: input.email,
            },
            email: {
              DataType: 'String',
              StringValue: input.email,
            },
            groupLabel: {
              DataType: 'String',
              StringValue: input.groupLabel && input.groupLabel !== '' ? input.groupLabel : 'null',
            },
          },
          MessageBody: JSON.stringify(input),
        })),
      });
      await sqsClient.getSqsClient().send(sendMessageBatchCommand);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to queue email registries...!!');
    }
  }
}
