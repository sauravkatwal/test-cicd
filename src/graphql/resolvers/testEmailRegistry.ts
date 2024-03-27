import { InformationEvent } from 'http';
import {
  CreditHelper,
  CursorPagination,
  Helper,
  SuccessResponse,
  VerifyEmail
} from '../../helpers';
import {
  ArgsTestEmailRegistryInterface,
  ContextInterface,
  InputTestEmailRegistryInterface,
} from '../../interfaces';
import { EmailRegistryStatusEnum, ServiceEnum } from '../../enums';
import { Guard, Validator } from '../../middlewares';
import {
  EmailRegistryEmailRegistryGroupService,
  TestEmailRegistryService,
} from '../../services';
import {
  createTestEmailRegistry,
  updateTestEmailRegistry,
} from '../../validators';

export const testEmailRegistryResolvers = {
  Mutation: {
    createTestEmailRegistry: async (
      parent: ParentNode,
      args: { input: InputTestEmailRegistryInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(createTestEmailRegistry, args.input);
      args.input.workspaceId = workspace.id;
      const data = await new TestEmailRegistryService(contextValue.models!).create(args.input);
      if (args.input.email) {
        const deduct = await CreditHelper.deductBalance({
          workspaceId: workspace.id,
          creditTotal: 1,
          service: ServiceEnum.bouncer,
          userId: user.id,
          models: contextValue.models!,
          emailRegistryIds: [data.id]
        });
        if (deduct === true) {
          await Helper.sanitizeTestEmailRegistry({ data, email: args.input.email, models: contextValue.models! });
        }
      }

      return SuccessResponse.send({
        message: 'Test Email Registry is successfully created.',
        data: data,
      });
    },
    updateTestEmailRegistry: async (
      parent: ParentNode,
      args: { id: number; input: InputTestEmailRegistryInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(updateTestEmailRegistry, args.input);
      args.input.workspaceId = workspace.id;
      args.input.status = EmailRegistryStatusEnum.unsanitized;
      args.input.sanitizedStatus = null;
      args.input.sanitizedReason = null;
      args.input.sanitizedResponse = null;

      const data = await new TestEmailRegistryService(contextValue.models!).updateOne(args.id, args.input);
      const emailRegistry = await new TestEmailRegistryService(contextValue.models!).findByPk(args.id);
      args.input.email ? emailRegistry.email = args.input.email : null;
      const deduct = await CreditHelper.deductBalance({
        workspaceId: workspace.id,
        creditTotal: 1,
        service: ServiceEnum.bouncer,
        userId: user.id,
        models: contextValue.models!,
        emailRegistryIds: [data.id]
      });
      if (deduct === true) {
        await Helper.sanitizeTestEmailRegistry({ data, email: emailRegistry.email, models: contextValue.models! })
      }

      return SuccessResponse.send({
        message: 'Test Email Registry is successfully updated.',
        data: data,
      });
    },
    deleteTestEmailRegistry: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      await new TestEmailRegistryService(contextValue.models!).deleteOne(args.id);
      await new EmailRegistryEmailRegistryGroupService(contextValue.models!).deleteMany({
        emailRegistryId: args.id,
      });
      return SuccessResponse.send({
        message: 'Test Email Registry is successfully deleted.',
      });
    },
    VerifyTestEmailRegistry: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      const emailRegistriesExists = await new TestEmailRegistryService(contextValue.models!).findByPk(args.id);
      const deduct = await CreditHelper.deductBalance({
        workspaceId: workspace.id,
        creditTotal: 1,
        service: ServiceEnum.bouncer,
        userId: user.id,
        models: contextValue.models!,
        emailRegistryIds: [emailRegistriesExists.id]
      });
      if (deduct === false) {
        return SuccessResponse.send({
          message: `Couldn't sanitize Test Email Registry. You don't have enough credits left!!`,
        });
      }
      const response = await VerifyEmail.verifyTestEmail({
        emailRegistry: emailRegistriesExists,
      });
      const data = await VerifyEmail.updateEmailRegistry({
        id: emailRegistriesExists.id,
        response: response,
        models: contextValue.models!
      });

      return SuccessResponse.send({
        message: 'Test Email Registry is successfully sanitized.',
        data: data,
      });
    }
  },

  Query: {
    testEmailRegistries: async (
      parent: ParentNode,
      args: ArgsTestEmailRegistryInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      let { status, emailRegistryGroupId, sanitizedStatus } = args;
      status = status ? status : undefined;
      sanitizedStatus = sanitizedStatus ? sanitizedStatus : undefined;
      emailRegistryGroupId = emailRegistryGroupId ? emailRegistryGroupId : undefined;

      const { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });

      const { cursorCount, count, rows } = await new TestEmailRegistryService(contextValue.models!).findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
        workspaceId: workspace.id,
        status,
        sanitizedStatus,
        emailRegistryGroupId,
      });

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: ' test users list is successfully fetched.',
        edges: data,
        pageInfo: pageInfo,
      });
    },
    testEmailRegistry: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const data = await new TestEmailRegistryService(contextValue.models!).findByPk(args.id);

      return SuccessResponse.send({
        message: 'Test Email Registry details is successfully fetched.',
        data: data,
      });
    },

  },
};
