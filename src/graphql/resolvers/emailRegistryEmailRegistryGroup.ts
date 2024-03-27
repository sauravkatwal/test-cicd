import { InformationEvent } from 'http';
import { SuccessResponse } from '../../helpers';
import { ContextInterface, InputEmailRegistryEmailRegistryGroupInterface } from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { EmailRegistryEmailRegistryGroupService } from '../../services';
import { addEmailRegistryEmailRegistryGroup } from '../../validators';

export const emailRegistryEmailRegistryGroupResolvers = {
  Mutation: {
    addEmailRegistryEmailRegistryGroup: async (
      parent: ParentNode,
      args: { input: InputEmailRegistryEmailRegistryGroupInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      Validator.check(addEmailRegistryEmailRegistryGroup, args.input);
      await new EmailRegistryEmailRegistryGroupService(contextValue.models!).create(args.input);

      return SuccessResponse.send({
        message: 'Email registry is successfully add to email registry group.',
      });
    },
    removeEmailRegistryEmailRegistryGroup: async (
      parent: ParentNode,
      args: { input: InputEmailRegistryEmailRegistryGroupInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      Validator.check(addEmailRegistryEmailRegistryGroup, args.input);
      await new EmailRegistryEmailRegistryGroupService(contextValue.models!).deleteMany(args.input);

      return SuccessResponse.send({
        message: 'Email registry is successfully removed from email registry group.',
      });
    },
  },
};
