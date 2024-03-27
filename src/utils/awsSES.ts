import {
  DeleteIdentityCommand,
  GetIdentityVerificationAttributesCommand,
  GetIdentityVerificationAttributesCommandOutput,
  ListIdentitiesCommand,
  SendEmailCommand,
  SendEmailCommandOutput,
  SendRawEmailCommand, SESClient,
  VerifyDomainIdentityCommand,
  VerifyEmailIdentityCommand,
} from '@aws-sdk/client-ses';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import { ses } from '../config';
import { IdentityType } from '../enums';
import { InputAwsSESInterface } from '../interfaces';

export class AwsSES {
  private static instance: AwsSES;
  private sesClient: SESClient;

  public constructor(accessKeyId?: string, accessKeySecret?: string, region?: string) {
    accessKeyId && accessKeySecret && region
      ? (this.sesClient = new SESClient({
          credentials: { accessKeyId: accessKeyId, secretAccessKey: accessKeySecret },
          region: region,
        }))
      : (this.sesClient = new SESClient({
          credentials: { accessKeyId: ses.accessKeyId, secretAccessKey: ses.secretAccessKey },
          region: ses.region,
        }));
  }

  sendEmail = (input: InputAwsSESInterface, configurationSetName?: string): Promise<SendEmailCommandOutput> => {
    const sendEmailCommand = new SendEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: input.destination,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: input.content,
          },
          // Text: {
          //   Charset: "UTF-8",
          //   Data: "TEXT_FORMAT_BODY",
          // },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: input.subject,
        },
      },
      Source: input.from ? input.from : 'no-reply-gump@genesesolution.com',
      ReplyToAddresses: input.reply_to_addresses,
      ...(input.configurationSetName && {
        ConfigurationSetName: configurationSetName ? configurationSetName : ses.configurationSetName,
      }),
    });
    return this.sesClient.send(sendEmailCommand);
  };

  sendEmailRaw = (input: InputAwsSESInterface): Promise<SentMessageInfo> => {
    let transporter = nodemailer.createTransport({
      SES: { ses: this.sesClient, aws: { SendRawEmailCommand } },
    });

    return transporter.sendMail({
      from: input.from,
      to: input.destination[0],
      subject: input.subject,
      html: input.content,
      attachments: [{ content: input.attachments![0].content, filename: input.attachments![0].filename }],
    });
  };

  verifyEmailIdentity = async (identityName: string) => {
    const verifyIdentityCommand = new VerifyEmailIdentityCommand({
      EmailAddress: identityName,
    });
    return this.sesClient.send(verifyIdentityCommand);
  };

  verifyDomainIdentity = async (identityName: string) => {
    const verifyIdentityCommand = new VerifyDomainIdentityCommand({
      Domain: identityName,
    });
    return this.sesClient.send(verifyIdentityCommand);
  };

  listIdentities = async (identityType: IdentityType) => {
    const listIdentitiesCommand = new ListIdentitiesCommand({ IdentityType: identityType });
    return this.sesClient.send(listIdentitiesCommand);
  };

  deleteIdentity = async (identityName: string) => {
    const deleteIdentityCommand = new DeleteIdentityCommand({ Identity: identityName });
    return this.sesClient.send(deleteIdentityCommand);
  };

  identityVerification(identities: string[]): Promise<GetIdentityVerificationAttributesCommandOutput> {
    const identityVerificationCommand = new GetIdentityVerificationAttributesCommand({ Identities: identities });
    return this.sesClient.send(identityVerificationCommand);
  }
}
