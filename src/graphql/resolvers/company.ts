import { InformationEvent } from 'http';
import { SuccessResponse } from '../../helpers';
import { ContextInterface, InputCompanyInterface } from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { AddressService, CompanyService, WorkspaceService } from '../../services';
import { createCompany } from '../../validators';

export const companyResolvers = {
  Mutation: {
    createCompany: async (
      parent: ParentNode,
      args: { input: InputCompanyInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(createCompany, args.input);
      args.input.user_id = user.id;
      args.input.workspace_id = workspace.id;
      const data = await new CompanyService().create(args.input);
      new WorkspaceService().updateOne(workspace.id, {
        label: args.input.name!,
      });
      return SuccessResponse.send({
        message: 'Company is successfully created.',
        data: data,
      });
    },
  },
  Query: {},
};
