import { GraphQLError } from 'graphql';
import { InformationEvent } from 'http';
import KSUID from 'ksuid';
import {
  EmailRegistryGroupStatusEnum,
  EmailRegistryGroupTypesEnum,
  EmailRegistrySanitizedStatusEnum,
  EmailRegistryStatusEnum,
  ServiceEnum,
} from '../../enums';
import { CreditHelper, CursorPagination, SuccessResponse, VerifyEmail } from '../../helpers';
import {
  ArgsEmailRegistryInterface,
  ContextInterface,
  EmailRegistryGroupInterface,
  EmailRegistryInterface,
  InBetweenDateExtend,
  InputEmailGroupRegistryWithEmailRegistriesInterface,
  InputEmailRegistryGroupInterface,
  InputEmailRegistryInterface,
} from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import {
  EmailRegistryEmailRegistryGroupService,
  EmailRegistryGroupService,
  EmailRegistryService,
} from '../../services';
import { Bouncer, EmailRegistryFilter } from '../../utils';
import {
  createEmailRegistryGroup,
  createEmailRegistryGroupWithEmailRegistries,
  updateEmailRegistryGroup,
} from '../../validators';
import { pgEmailRegistryGroupMaxLimit } from '../../config';

export const emailRegistryGroupResolvers = {
  Mutation: {
    createEmailRegistryGroup: async (
      parent: ParentNode,
      args: { input: InputEmailRegistryGroupInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(createEmailRegistryGroup, args.input);
      args.input.workspaceId = workspace.id;
      args.input.groupCode = KSUID.randomSync().string;
      let emailRegistryGroup: EmailRegistryGroupInterface;
      let emailIds: number[] = [];
      if (args.input.csvData && args.input.filterCriteria) {
        args.input.csvData.forEach((item) => {
          item.workspaceId = workspace.id;
          item.email = item.email.toLowerCase();
        });
        const bulkCreateData = await new EmailRegistryService(contextValue.models!).bulkCreate(args.input.csvData);
        emailIds = bulkCreateData.map((user: EmailRegistryInterface) => user.id);
        const data = await EmailRegistryFilter.filterData(args.input.filterCriteria, workspace.id, contextValue.models!, args.input.csvData);
        if (data) {
          const emailRegistries: number[] = data;
          emailRegistryGroup = await new EmailRegistryGroupService(contextValue.models!).create({
            ...args.input,
            filterCriteria: args.input.filterCriteria,
            emailRegistries,
          });
        }
      } else if (args.input.csvData) {
        args.input.csvData.forEach((item) => {
          item.workspaceId = workspace.id;
          item.email = item.email.toLowerCase();
        });
        const data = await new EmailRegistryService(contextValue.models!).bulkCreate(args.input.csvData);
        emailIds = data.map((user: EmailRegistryInterface) => user.id);
        if (data) {
          emailRegistryGroup = await new EmailRegistryGroupService(contextValue.models!).create({
            ...args.input,
            emailRegistries: emailIds,
          });
        }
      } else if (args.input.emailRegistries && args.input.filterCriteria) {
        const data = await EmailRegistryFilter.filterData(
          args.input.filterCriteria,
          workspace.id,
          contextValue.models!,
          undefined,
          args.input.emailRegistries,
        );
        if (data) {
          const emailRegistries: number[] = data;
          emailRegistryGroup = await new EmailRegistryGroupService(contextValue.models!).create({
            ...args.input,
            filterCriteria: args.input.filterCriteria,
            emailRegistries,
          });
        }
      } else if (args.input.emailRegistries) {
        emailRegistryGroup = await new EmailRegistryGroupService(contextValue.models!).create(args.input);
      }

      const inputEmails = args.input.emailRegistries ? args.input.emailRegistries : emailIds;
      const emailRegistries = await new EmailRegistryService(contextValue.models!).findAll({
        ids: inputEmails,
        workspaceId: workspace.id,
        status: EmailRegistryStatusEnum.unsanitized,
      });
      let report;
      if (args.input.sanitize && emailRegistries.length > 0) {
        try {
          const credits = await Bouncer.checkCreditAvailable();
          if (credits.data.credits < emailRegistries.length) {
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
        const balance = await CreditHelper.getAvailableBalance({ workspaceId: workspace.id, service: ServiceEnum.bouncer});
        if (balance < emailRegistries.length) {
          return SuccessResponse.send({
            message: `Email registry group is successfully created, but you don't have enough credits ko sanitize!!`,
          });
        }
        report = await VerifyEmail.verifyEmails({
          emailRegistries: emailRegistries,
          userId: user.id,
          workspaceId: workspace.id,
          models: contextValue.models!,
          workspaceSecret: workspace.secret,
          emailRegistryGroupId: emailRegistryGroup!.id,
        });
      }
      return SuccessResponse.send({
        message: 'Email registry group is successfully created.',
        data: report,
      });
    },
    updateEmailRegistryGroup: async (
      parent: ParentNode,
      args: { id: number; input: InputEmailRegistryGroupInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      Validator.check(updateEmailRegistryGroup, args.input);
      args.input.workspaceId = workspace.id;
      const data = await new EmailRegistryGroupService(contextValue.models!).updateOne(args.id, args.input);

      return SuccessResponse.send({
        message: 'Email registry group is successfully updated.',
        data: data,
      });
    },
    deleteEmailRegistryGroup: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      await new EmailRegistryGroupService(contextValue.models!).deleteOne(args.id);
      await new EmailRegistryEmailRegistryGroupService(contextValue.models!).deleteMany({
        emailRegistryGroupId: args.id,
      });
      return SuccessResponse.send({
        message: 'Email registry group is successfully deleted.',
      });
    },
    createEmailRegistryGroupWithEmailRegistries: async (
      parent: ParentNode,
      args: { input: InputEmailGroupRegistryWithEmailRegistriesInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(createEmailRegistryGroupWithEmailRegistries, args.input);
      args.input.emailRegistries = args.input.emailRegistries.map((item: InputEmailRegistryInterface) => {
        item.email = item.email.toLowerCase();
        return {
          ...item,
          workspaceId: workspace.id,
        };
      });
      await new EmailRegistryService(contextValue.models!).bulkCreate(args.input.emailRegistries);
      const emails: string[] = args.input.emailRegistries.map((item: InputEmailRegistryInterface) => item.email);
      const emailRegistries = await new EmailRegistryService(contextValue.models!).findAll({
        emails: emails,
        workspaceId: workspace.id,
      });
      const emailRegistryGroup = await new EmailRegistryGroupService(contextValue.models!).create({
        label: args.input.label,
        status: args.input.status,
        type: args.input.type,
        workspaceId: workspace.id,
        emailRegistries: emailRegistries.map((item: EmailRegistryInterface) => item.id),
      });

      let report;
      if (args.input.sanitize) {
        try {
          const credits = await Bouncer.checkCreditAvailable();
          if (credits.data.credits < emailRegistries.length) {
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
        const balance = await CreditHelper.getAvailableBalance({ workspaceId: workspace.id, service: ServiceEnum.bouncer});
        if (balance < emailRegistries.length) {
          return SuccessResponse.send({
            message: `Email registry group with email registries is successfully created, but you don't have enough credits ko sanitize!!`,
          });
        }
        report = await VerifyEmail.verifyEmails({
          emailRegistries: emailRegistries,
          userId: user.id,
          workspaceId: workspace.id,
          models: contextValue.models!,
          workspaceSecret: workspace.secret,
          emailRegistryGroupId: emailRegistryGroup.id,
        });
      }

      return SuccessResponse.send({
        message: 'Email registry group with email registries is successfully created.',
        data: report,
      });
    },
  },
  Query: {
    emailRegistryGroups: async (
      parent: ParentNode,
      args: ArgsEmailRegistryInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      let { status, type } = args;
      status = status ? status : undefined;
      type = type ? type : undefined;

      let { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });
      limit = limit && (limit > pgEmailRegistryGroupMaxLimit) ? pgEmailRegistryGroupMaxLimit : limit;

      const { cursorCount, count, rows } = await new EmailRegistryGroupService(contextValue.models!).findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
        workspaceId: workspace.id,
        status,
        type,
      });

      const response = rows.map(async(group) => {
        group.summary = await new EmailRegistryGroupService(contextValue.models!).groupSummary({emailRegistryGroupId: group.id});
        group.emailRegistryCount = 0; 
        group.summary.forEach((item) => {
          if (item.status) {
            group.emailRegistryCount! += Number(item.count);
          } 
        });
      })

      await Promise.all(response);

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: ' Email Registry groups  list is successfully fetched.',
        edges: data,
        pageInfo: pageInfo,
      });
    },
    emailRegistryGroup: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const data = await new EmailRegistryGroupService(contextValue.models!).findByPk(args.id);

      return SuccessResponse.send({
        message: 'Email registry group details is successfully fetched.',
        data: data,
      });
    },
    emailRegistryGroupStatusSummaries: async (
      parent: ParentNode,
      args: InBetweenDateExtend,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const active = await new EmailRegistryGroupService(contextValue.models!).count({
        workspaceId: workspace.id,
        emailRegistryGroupStatus: EmailRegistryGroupStatusEnum.active,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const inactive = await new EmailRegistryGroupService(contextValue.models!).count({
        workspaceId: workspace.id,
        emailRegistryGroupStatus: EmailRegistryGroupStatusEnum.inactive,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });

      const response = [
        { status: EmailRegistryGroupStatusEnum.active, count: active },
        { status: EmailRegistryGroupStatusEnum.inactive, count: inactive },
        { status: 'total', count: active + inactive },
      ];

      return SuccessResponse.send({
        message: 'Email Group Counts is successfully fetched.',
        data: response.map(({ status, count }) => ({ status: status, count: count })),
      });
    },
    emailRegistryGroupCountSummaries: async (
      parent: ParentNode,
      args: InBetweenDateExtend,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const email = await new EmailRegistryGroupService(contextValue.models!).count({
        workspaceId: workspace.id,
        EmailRegistryGroupType: EmailRegistryGroupTypesEnum.email,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const message = await new EmailRegistryGroupService(contextValue.models!).count({
        workspaceId: workspace.id,
        EmailRegistryGroupType: EmailRegistryGroupTypesEnum.message,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const response = [
        { status: EmailRegistryGroupTypesEnum.email, count: email },
        { status: EmailRegistryGroupTypesEnum.message, count: message },
        { status: 'total', count: email + message },
      ];

      return SuccessResponse.send({
        message: 'Email Group Counts is successfully fetched.',
        data: response.map(({ status, count }) => ({ status: status, count: count })),
      });
    },
  },
};
