import { GraphQLError } from 'graphql';
import KSUID from 'ksuid';
import { Base64, VerifyEmail } from '.';
import { frontendHostBaseUrl } from '../config';
import { EmailRegistrySanitizedStatusEnum, EmailRegistryStatusEnum } from '../enums';
import {
  CredentialInterface,
  EmailRegistryInterface,
  IdentityVerificationInterface,
  InputIdentityVerificationInterface,
  ModelsInterface,
  TestEmailRegistryInterface,
  UserInterface,
  WorkspaceInterface
} from '../interfaces';
import { EmailRegistryService, IdentityVerificationService } from '../services';
import { AwsSES, Bouncer } from '../utils';

class Helper {
  static instance: Helper;
  constructor() { }

  static get(): Helper {
    if (!Helper.instance) {
      Helper.instance = new Helper();
    }
    return Helper.instance;
  }

  generateInvitationLink({ user, workspace }: { user: UserInterface; workspace: WorkspaceInterface }): string {
    return `${frontendHostBaseUrl}/auth/users-invitation/${Base64.encode({
      email: user.email!,
      workspace: workspace.secret,
      name: user.email,
      password_required: user.sub ? false : true,
    })}`;
  }

  async sendInvitationLink({
    email,
    userWorkspaceId,
    subject,
    credentials,
  }: {
    email: string;
    userWorkspaceId: number;
    subject: string;
    credentials?: CredentialInterface;
  }) {
    const input: InputIdentityVerificationInterface = {
      identity: email,
      token: KSUID.randomSync().string,
      meta: { userWorkspaceId: userWorkspaceId },
    };
    await new IdentityVerificationService().create(input);
    const link = `${frontendHostBaseUrl}/auth/users-invitation/${input.token}`;
    credentials
      ? await new AwsSES(
        credentials.secret.awsSesAccessKeyId,
        credentials.secret.awsSesAccessKeySecret,
        credentials.secret.awsSesRegion,
      ).sendEmail({
        destination: [email],
        subject: subject,
        content: `Your invitation link is: <a href=${link}>${link}</a>`,
      })
      : await new AwsSES().sendEmail({
        destination: [email],
        subject: subject,
        content: `Your invitation link is: <a href=${link}>${link}</a>`,
      });
  }

  public async verifyToken(token: string): Promise<IdentityVerificationInterface> {
    const identityVerification = await new IdentityVerificationService().findOne({
      token: token,
      expiryDate: new Date(),
    });
    if (!identityVerification) {
      throw new Error('Invalid or expired token');
    }
    return identityVerification;
  }

  async sanitizeEmailRegistry({ data, email, models }: { data: EmailRegistryInterface; email: string; models: ModelsInterface }) {
    const response = await VerifyEmail.verifyEmail({
      emailRegistry: data,
    });
    const { email: emailResponse, reason, status, ...restSanitizedResponse } = response.data;
    await new EmailRegistryService(models).update(
      { email: email },
      {
        status: EmailRegistryStatusEnum.sanitized,
        sanitizedStatus: status,
        sanitizedReason: reason,
        sanitizedResponse: { reason, status, ...restSanitizedResponse },
        sanitizedDate: new Date(),
        ...(status === EmailRegistrySanitizedStatusEnum.deliverable && {
          emailVerified: true,
        }),
      },
    );
  }

  async sanitizeTestEmailRegistry({ data, email, models }: { data: TestEmailRegistryInterface; email: string; models: ModelsInterface }) {
    try {
      const credits = await Bouncer.checkCreditAvailable();
      if (credits.data.credits < 1) {
        console.info(`Insufficient credits at usebouncer: ${credits.data.credits}, please recharge your usebouncer`);
        throw new GraphQLError('Could not proceed with email sanitization, please contact support!', {
          extensions: {
            code: 'FORBIDDEN',
            argumentName: 'usebouncer credits',
            message: `Insufficient credits at usebouncer: ${credits.data.credits}, please recharge your usebouncer`,
            http: {
              status: 200,
            },
          },
        });
      }
    } catch (error: any) {
      return error.data;
    }

    const response = await VerifyEmail.verifyTestEmail({ emailRegistry: data });
    const { email: emailResponse, reason, status, ...restSanitizedResponse } = response.data;
    await new EmailRegistryService(models).update(
      { email: email },
      {
        status: EmailRegistryStatusEnum.sanitized,
        sanitizedStatus: status,
        sanitizedReason: reason,
        sanitizedResponse: { reason, status, ...restSanitizedResponse },
        ...(status === EmailRegistrySanitizedStatusEnum.deliverable && {
          emailVerified: true,
        }),
      },
    );
  }

  async checkAndThrowError(service: any, field: string, value: string, argumentName: string) {
    const data = await service.findOne({ [field]: value });
    if (data) {
      throw new GraphQLError(`${argumentName}: ${value} already exists!`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: argumentName,
        },
      });
    }
  }
}

const helper = Helper.get();

export { helper as Helper };
