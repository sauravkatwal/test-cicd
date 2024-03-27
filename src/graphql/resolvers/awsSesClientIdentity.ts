import { InformationEvent } from 'http';
import { defaultOrder, defaultSort, pgMaxLimit, pgMinLimit } from '../../config';
import { AwsSesStatus, IdentityType } from '../../enums';
import { CursorPagination, SuccessResponse } from '../../helpers';
import {
  ArgsAWSSesClientIdentitiyInterface,
  ContextInterface,
  InputAWSSesClientIdentityInterface,
} from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { AWSSesClientIdentityService } from '../../services';
import { AwsSES } from '../../utils';
import { createIdentity } from '../../validators';

export const awsSesClientIdentityResolver = {
  Mutation: {
    createAwsSesClientIdentity: async (
      parent: ParentNode,
      args: { input: InputAWSSesClientIdentityInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Validator.check(createIdentity, args.input);
      args.input.workspaceId = workspace.id;
      const data = await new AWSSesClientIdentityService(contextValue.models!).create(args.input);
      switch (args.input.type) {
        case IdentityType.EmailAddress:
          await new AwsSES().verifyEmailIdentity(args.input.identity);
          break;

        case IdentityType.Domain:
          await new AwsSES().verifyDomainIdentity(args.input.identity);
          break;
      }

      return SuccessResponse.send({
        message: 'Aws ses Identity is successfully created.',
        data: data,
      });
    },
    deleteAwsSesClientIdentity: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const data = await new AWSSesClientIdentityService(contextValue.models!).deleteIdentity({id: args.id, workspaceId: workspace.id});
      await new AwsSES().deleteIdentity(data.identity);

      return SuccessResponse.send({
        message: 'Aws ses Identity is successfully deleted.',
      });
    },
    
    resendVerifyLinkAwsSesClientIdentity: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const data = await new AWSSesClientIdentityService(contextValue.models!).findByPk(args.id);
      await new AwsSES().verifyEmailIdentity(data.identity);
    
      return SuccessResponse.send({
        message: 'Verification link is sent to your email address!.',
      });
    }
  },
  Query: {
    listIdentities: async (
      parent: ParentNode,
      args: ArgsAWSSesClientIdentitiyInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      let { status, updateBeforeFetch } = args;
      status = status ? status : undefined;
      updateBeforeFetch = updateBeforeFetch ? updateBeforeFetch : true;

      const { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });

      const {cursorCount, count, rows} = await new AWSSesClientIdentityService(contextValue.models!).findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
        workspaceId: workspace.id,
        status,
      });
      if(updateBeforeFetch === true){
        const response = 
        rows.map(async (item) => {
          const result = await new AwsSES().identityVerification([item.identity]);
          if (result?.VerificationAttributes) {
            const awsResult = result.VerificationAttributes[item.identity]?.VerificationStatus;
            const awsStatus = awsResult?.toLowerCase() as AwsSesStatus;
            await new AWSSesClientIdentityService(contextValue.models!).updateOne({ id: item.id, input: { status: awsStatus } });
            return item.status = awsStatus;
          }
        });
      await Promise.all(response);
      }
      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: 'Aws ses Identity list is successfully fetched.',
        data: data,
        pageInfo: pageInfo,
      });
    },
    listIdentity: async (
      parent: ParentNode,
      args: { input: InputAWSSesClientIdentityInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      args.input.workspaceId = workspace.id;
      const identities = await new AWSSesClientIdentityService(contextValue.models!).findOne(args.input);
      return SuccessResponse.send({
        message: 'Aws ses Identity list is successfully fetched.',
        data: identities,
      });
    },
  },
};