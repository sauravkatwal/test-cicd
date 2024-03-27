import { InformationEvent } from 'http';
import { ContextInterface } from '../../interfaces';
import { Guard } from '../../middlewares';
import { CredentialService } from '../../services';
import { SuccessResponse } from '../../helpers';
import { MessagingPlatformEnum } from '../../enums';

export const sparrowSmsCredentialResolvers = {
  Mutation: {},
  Query: {
    sparrowSmsCreddential: async (
      parent: ParentNode,
      args: {},
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      const data = await new CredentialService(contextValue.models!).findOne(
        { isActive: true, workspaceId: workspace.id },
        MessagingPlatformEnum.sms,
      );
      return SuccessResponse.send({
        message: 'Sms Credentials is successfully fetched.',
        data: data,
      });
    },
  },
};
