import { GraphQLError } from 'graphql';
import { InformationEvent } from 'http';
import { EmailTemplateApprovedStatus, MessagingPlatformEnum, ServiceEnum } from '../../enums';
import { CreditHelper, CursorPagination, SuccessResponse, Ksuid } from '../../helpers';
import {
  ArgsEmailTemplateInterface,
  ContextInterface,
  InBetweenDateExtend,
  InputAwsSESInterface,
  InputEmailTemplateInterface,
  InputMessage,
  InputSendSampleEmailTemplateInterface,
  InputSparrowViberMessage,
} from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import {
  CredentialService,
  EmailTemplateService, TestEmailRegistryService
} from '../../services';
import { AwsSES, SMS, Viber, Whatsapp } from '../../utils';
import { createEmailTemplate, updateEmailTemplate } from '../../validators';

export const emailTemplateResolvers = {
  Mutation: {
    createEmailTemplate: async (
      parent: ParentNode,
      args: { input: InputEmailTemplateInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(createEmailTemplate, args.input);
      args.input.workspace_id = workspace.id;
      args.input.created_by_id = user.id;
      args.input.updated_by_id = user.id;
      args.input.templateCode = Ksuid.randomSync();

      switch (args.input.messagingPlatform) {
        case MessagingPlatformEnum.whatsapp:
          const whatsAppInput = {
            name: args.input.name,
            language: 'en',
            category: 'MARKETING',
            components: args.input.content.components,
          };
          const response = await Whatsapp.createWhatsappTemplate(whatsAppInput);
          if (response.data.error) throw new Error(response.data.error.error_user_msg);
      }

      const data = await new EmailTemplateService(contextValue.models!).create(args.input);
      return SuccessResponse.send({
        message: `${
          args.input.messagingPlatform.charAt(0).toUpperCase() + args.input.messagingPlatform.slice(1)
        } template is successfully created.`,
        data: data,
      });
    },
    updateEmailTemplate: async (
      parent: ParentNode,
      args: { id: number; input: InputEmailTemplateInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(updateEmailTemplate, args.input);
      args.input.workspace_id = workspace.id;
      args.input.updated_by_id = user.id;
      const data = await new EmailTemplateService(contextValue.models!).updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: 'Template is successfully updated.',
        data: data,
      });
    },
    deleteEmailTemplate: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      await new EmailTemplateService(contextValue.models!).deleteOne(args.id);
      return SuccessResponse.send({
        message: 'Template is successfully deleted.',
      });
    },
    sendSampleEmailTemplate: async (
      parent: ParentNode,
      args: { input: InputSendSampleEmailTemplateInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      const deduct = await CreditHelper.deductBalance({
        workspaceId: workspace.id,
        creditTotal: 1,
        service: ServiceEnum.email,
        userId: user.id,
        models: contextValue.models!,
      });
      if (deduct === false) {
        throw new Error(`Couldn't send Test Email. You don't have enough credits!!`);
      }
      let destination: string[] = [];
      if (args.input.destination) {
        destination.push(args.input.destination);
      }
      const emailExist = await new TestEmailRegistryService(contextValue.models!).findOne({
        email: args.input.destination,
        workspaceId: workspace.id,
      });
      const testEmailInput: InputAwsSESInterface = {
        destination: destination,
        content: args.input.content.replaceAll('[email]', args.input.destination).replaceAll('[name]', emailExist.name),
        subject: args.input.subject,
      };

      try {
        const credentials = await new CredentialService(contextValue.models!).findOne(
          { isActive: true, workspaceId: workspace.id },
          MessagingPlatformEnum.email,
        );
        await new AwsSES(
          credentials.secret.awsSesAccessKeyId,
          credentials.secret.awsSesAccessKeySecret,
          credentials.secret.awsSesRegion,
        ).sendEmail(testEmailInput);
      } catch (error) {
        await new AwsSES().sendEmail(testEmailInput);
        return SuccessResponse.send({
          message: 'Test email  has been successfully send.',
        });
      }

      return SuccessResponse.send({
        message: 'Test email  has been successfully send.',
      });
    },
    sendTestSms: async (
      parent: ParentNode,
      args: { input: InputMessage },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      const deduct = await CreditHelper.deductBalance({
        workspaceId: workspace.id,
        creditTotal: 1,
        service: ServiceEnum.sms,
        userId: user.id,
        models: contextValue.models!,
      });
      if (deduct === false) {
        throw new Error(`Couldn't send Test Message. You don't have enough credits!!`);
      }
      const credentials = await new CredentialService(contextValue.models!).findOne(
        { isActive: true, workspaceId: workspace.id },
        MessagingPlatformEnum.sms,
      );
      await SMS.sendSMSMessage(
        args.input,
        credentials.secret.sparrorSmsAccessToken!,
        credentials.secret.sparrowSmsFrom!,
        credentials.secret.sparrowSmsBaseUrl!,
      );

      return SuccessResponse.send({
        message: 'Test  message  has been successfully send.',
      });
    },
    sendTestViberMessage: async (
      parent: ParentNode,
      args: { input: InputSparrowViberMessage },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      const deduct = await CreditHelper.deductBalance({
        workspaceId: workspace.id,
        creditTotal: 1,
        service: ServiceEnum.viber,
        userId: user.id,
        models: contextValue.models!,
      });
      if (deduct === false) {
        throw new GraphQLError(`Couldn't send Test Message. You don't have enough credits!`, {
          extensions: {
            code: 'FORBIDDEN',
            argumentName: 'viber credit',
            message: `Couldn't send Test Message. You don't have enough credits!`,
            http: {
              status: 200,
            },
          },
        });
      }
      const credentials = await new CredentialService(contextValue.models!).findOne(
        { isActive: true, workspaceId: workspace.id },
        MessagingPlatformEnum.viber,
      );
      const viberInput = {
        ...args.input,
        senderName: credentials.secret.sparrowViberSenderName,
      };
      try {
        await Viber.sendViberMessage(viberInput, contextValue.models!);

        return SuccessResponse.send({
          message: 'Test  message  has been successfully send.',
        });
      } catch (error) {
        console.error(error);
        throw new GraphQLError('Could not send viber message, please contact support!', {
          extensions: {
            code: 'FORBIDDEN',
            argumentName: 'viber',
            message: `Could not send viber message, please contact support!`,
            http: {
              status: 200,
            },
          },
        });
      }
    },
    sendTestWhatsappMessage: async (
      parent: ParentNode,
      args: { input: InputMessage },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      await Whatsapp.sendWhatsappMessage(args.input);

      return SuccessResponse.send({
        message: 'Test whatsapp message  has been successfully send.',
      });
    },
    duplicateEmailTemplate: async (
      parent: ParentNode,
      args: { id: number; input: InputEmailTemplateInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const templateToDuplicate = await new EmailTemplateService(contextValue.models!).findByPk(args.id);
      const newTemplate: InputEmailTemplateInterface = {
        name: args.input.name,
        content: templateToDuplicate.content,
        messagingPlatform: templateToDuplicate.messagingPlatform,
        content_html: templateToDuplicate.content_html,
        description: args.input.description,
        workspace_id: templateToDuplicate.workspace_id,
        created_by_id: templateToDuplicate.created_by_id,
        updated_by_id: templateToDuplicate.updated_by_id,
        templateCode: Ksuid.randomSync(),
      };
      const data = await new EmailTemplateService(contextValue.models!).create(newTemplate);
      return SuccessResponse.send({
        message: ' Template is successfully duplicated.',
        data: data,
      });
    },
    approveEmailTemplate: async (
      parent: ParentNode,
      args: { id: number; approvedStatus: EmailTemplateApprovedStatus },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let input: Partial<InputEmailTemplateInterface> = {};
      input.approvedStatus = args.approvedStatus;
      const data = await new EmailTemplateService(contextValue.models!).update({ id: args.id, input });
      return SuccessResponse.send({
        message: `Template is ${args.approvedStatus} successfully updated.`,
        data: data,
      });
    },
  },
  Query: {
    emailTemplates: async (
      parent: ParentNode,
      args: ArgsEmailTemplateInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { messagingPlatform } = args;
      messagingPlatform = messagingPlatform ? messagingPlatform : undefined;

      const { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });

      const { cursorCount, count, rows } = await new EmailTemplateService(contextValue.models!).findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
        messagingPlatform,
        workspace_id: workspace.id,
      });
      
      rows.map((template) => {
        template.updateDeleteEnabled = !(template.campaignSchedule && template.campaignSchedule.length > 0);
      })

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });
      return SuccessResponse.send({
        message: 'Template list is successfully fetched.',
        edges: data,
        pageInfo: pageInfo,
      });
    },
    emailTemplate: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const data = await new EmailTemplateService(contextValue.models!).findByPk(args.id);
      return SuccessResponse.send({
        message: 'Template details is successfully fetched.',
        data: data,
      });
    },
    emailTemplateStatusCountSummaries: async (
      parent: ParentNode,
      args: InBetweenDateExtend,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      const approved = await new EmailTemplateService(contextValue.models!).count({
        workspaceId: workspace.id,
        approvedStatus: EmailTemplateApprovedStatus.approved,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const pending = await new EmailTemplateService(contextValue.models!).count({
        workspaceId: workspace.id,
        approvedStatus: EmailTemplateApprovedStatus.pending,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const rejected = await new EmailTemplateService(contextValue.models!).count({
        workspaceId: workspace.id,
        approvedStatus: EmailTemplateApprovedStatus.rejected,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const response = [
        { status: EmailTemplateApprovedStatus.approved, count: approved },
        { status: EmailTemplateApprovedStatus.pending, count: pending },
        { status: EmailTemplateApprovedStatus.rejected, count: rejected },
        { status: 'total', count: approved + pending + rejected },
      ];

      return SuccessResponse.send({
        message: 'Template Counts is successfully fetched.',
        data: response.map(({ status, count }) => ({ status: status, count: count })),
      });
    },
  },
};
