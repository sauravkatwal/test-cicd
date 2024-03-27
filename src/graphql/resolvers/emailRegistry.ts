import { GraphQLError } from 'graphql';
import { InformationEvent } from 'http';
import { EmailRegistrySanitizedStatusEnum, EmailRegistryStatusEnum, ServiceEnum, WorkspaceResourcePurposeEnum, WorkspaceResourceTypeEnum } from '../../enums';
import { CreditHelper, CursorPagination, Helper, SuccessResponse, VerifyEmail } from '../../helpers';
import {
  ArgsEmailRegistryInterface,
  ContextInterface,
  EmailRegistryInterface,
  InBetweenDateExtend,
  InputEmailRegistriesWithEmailRegistryGroupId,
  InputEmailRegistryEmailRegistryGroupInterface,
  InputImportEmailRegistryInterface,
  InputEmailRegistryInterface,
  InputSanitizationEmailRegistries,
} from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { AttributeService, CountryDivisionService, EmailRegistryEmailRegistryGroupService, EmailRegistryService, WorkspaceResourceService } from '../../services';
import { Bouncer } from '../../utils';
import {
  createEmailRegistries,
  createEmailRegistriesWithEmailRegistryGroup,
  createEmailRegistry,
  updateEmailRegistry,
} from '../../validators';
import { SQSProducer } from '../../producers';
import { AwsSQSClient } from '../../config';
// import { IoRedis } from "../../config/ioredis";
export const emailRegistryResolvers = {
  Mutation: {
    createEmailRegistry: async (
      parent: ParentNode,
      args: { input: InputEmailRegistryInterface; sanitize: boolean },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(createEmailRegistry, args.input);
      args.input.workspaceId = workspace.id;
      args.input.email = args.input.email.toLowerCase();
      const data = await new EmailRegistryService(contextValue.models!).create(args.input);
      if (args.sanitize) {
        const deduct = await CreditHelper.deductBalance({
          workspaceId: workspace.id,
          creditTotal: 1,
          service: ServiceEnum.bouncer,
          userId: user.id,
          models: contextValue.models!,
          emailRegistryIds: [data.id],
        });
        if (deduct === false) {
          return SuccessResponse.send({
            message: `Email registry is successfully created, but you dont have enough credit to sanitize!!`,
          });
        }
        data.email = args.input.email;
        await Helper.sanitizeEmailRegistry({ data, email: args.input.email, models: contextValue.models! });
      }
      return SuccessResponse.send({
        message: 'Email registry is successfully created.',
        data: data,
      });
    },
    updateEmailRegistry: async (
      parent: ParentNode,
      args: { id: number; input: InputEmailRegistryInterface; sanitize: boolean },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(updateEmailRegistry, args.input);
      args.input.workspaceId = workspace.id;
      if (args.input.email) {
        args.input.status = EmailRegistryStatusEnum.unsanitized;
        args.input.sanitizedStatus = undefined;
        args.input.sanitizedReason = undefined;
        args.input.sanitizedResponse = undefined;
        args.input.email = args.input.email.toLowerCase();
      }
      const data = await new EmailRegistryService(contextValue.models!).updateOne(args.id, args.input);
      if (args.sanitize) {
        const deduct = await CreditHelper.deductBalance({
          workspaceId: workspace.id,
          creditTotal: 1,
          service: ServiceEnum.bouncer,
          userId: user.id,
          models: contextValue.models!,
          emailRegistryIds: [data.id],
        });
        if (deduct === false) {
          return SuccessResponse.send({
            message: `Email registry is successfully updated, but you dont have enough credit to sanitize!!`,
          });
        }
        const emailRegistry = await new EmailRegistryService(contextValue.models!).findByPk(args.id);
        args.input.email ? (emailRegistry.email = args.input.email) : null;
        await Helper.sanitizeEmailRegistry({ data, email: emailRegistry.email, models: contextValue.models! });
      }
      return SuccessResponse.send({
        message: 'Email registry is successfully updated.',
        data: data,
      });
    },
    deleteEmailRegistry: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      await new EmailRegistryService(contextValue.models!).deleteOne(args.id);
      await new EmailRegistryEmailRegistryGroupService(contextValue.models!).deleteMany({
        emailRegistryId: args.id,
      });
      return SuccessResponse.send({
        message: 'Email registry is successfully deleted.',
      });
    },
    verifyEmailRegistry: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      const emailRegistriesExists = await new EmailRegistryService(contextValue.models!).findByPk(args.id);
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
      const deduct = await CreditHelper.deductBalance({
        workspaceId: workspace.id,
        creditTotal: 1,
        service: ServiceEnum.bouncer,
        userId: user.id,
        models: contextValue.models!,
        emailRegistryIds: [emailRegistriesExists.id],
      });
      if (deduct === false) {
        throw new GraphQLError('Insufficient credits, please contact support!', {
          extensions: {
            code: 'FORBIDDEN',
            argumentName: 'credits',
            message: `Insufficient credits, please contact support!`,
            http: {
              status: 200,
            },
          },
        });
      }
      const response = await VerifyEmail.verifyEmail({
        emailRegistry: emailRegistriesExists,
      });
      const data = await VerifyEmail.updateEmailRegistry({
        id: emailRegistriesExists.id,
        response: response,
        models: contextValue.models!
      });

      return SuccessResponse.send({
        message: 'Email registry is successfully sanitized.',
        data: data,
      });
    },
    verifyEmailRegistries: async (
      parent: ParentNode,
      args: { ids: number[] },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      const data = await new EmailRegistryService(contextValue.models!).findAll({
        ids: args.ids,
        workspaceId: workspace.id,
      });
      try {
        const credits = await Bouncer.checkCreditAvailable();
        if (credits.data.credits < data.length) {
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
      if (balance < data.length) {
        throw new GraphQLError('Insufficient credits, please contact support!', {
          extensions: {
            code: 'FORBIDDEN',
            argumentName: 'credits',
            message: `Insufficient credits, please contact support!`,
            http: {
              status: 200,
            },
          },
        });
      }
      const report = await VerifyEmail.verifyEmails({
        emailRegistries: data,
        userId: user.id,
        workspaceId: workspace.id,
        models: contextValue.models!,
        workspaceSecret: workspace.secret
      });

      return SuccessResponse.send({
        message: 'Email registries are queued for sanitized.',
        data: report,
      });
    },
    createEmailRegistries: async (
      parent: ParentNode,
      args: { input: InputImportEmailRegistryInterface[]; sanitize: boolean },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      Validator.check(createEmailRegistries, args.input);

      if (args.sanitize) {
        try {
          const deduct = await CreditHelper.deductBalance({
            workspaceId: workspace.id,
            creditTotal: args.input.length,
            service: ServiceEnum.bouncer,
            userId: user.id,
            models: contextValue.models!,
          });
          if (deduct === false) {
            args.sanitize = false;
          }
        } catch (error: any) {
          return error.data;
        }
      }

      const [ gender, nationality, provinces, districts, workspaceResource ] = await Promise.all([
        new AttributeService().findAll({ name: 'gender' }),
        await new AttributeService().findAll({name: 'nationality' }),
        new CountryDivisionService().findAll({
          type: 'state'
        }),
        new CountryDivisionService().findAll({
          type: 'district'
        }),
        new WorkspaceResourceService(contextValue.models!).findOne({
          workspaceId: workspace.id,
          type: WorkspaceResourceTypeEnum.sqs,
          purpose: WorkspaceResourcePurposeEnum.import
        })
      ]);

      const genderMap = new Map(gender[0].attributeValues!.map((gender) => [gender.value, gender.id]));
      const nationalityMap = new Map(nationality[0].attributeValues!.map((nationality) => [nationality.value, nationality.id]));
      const provinceMap = new Map(provinces.map((province) => [province.name, province.id]));
      const districtMap = new Map(districts.map((district) => [district.name, district.id]));

      const awsSQSClient = new AwsSQSClient({
        workspaceSecret: workspace.secret,
        purpose: WorkspaceResourcePurposeEnum.import,
        credentials: workspaceResource.credentials,
      });
      const batchSize = 10, batches = [];
      const messages = args.input.map((item: InputImportEmailRegistryInterface) => ({
        name: item.name.toLowerCase(),
        email: item.email,
        phoneNumber: item.phoneNumber,
        description: item.description,
        genderId: item.genderId 
          ? item.genderId 
          : item.gender && genderMap.has(item.gender) 
          ? genderMap.get(item.gender) 
          : undefined,
        dob: item.dob,
        nationalityId: item.nationalityId 
          ? item.nationalityId 
          : item.nationality && nationalityMap.has(item.nationality) 
          ? nationalityMap.get(item.nationality) 
          : undefined,
        provinceId: item.provinceId 
          ? item.provinceId 
          : item.province && provinceMap.has(item.province) 
          ? nationalityMap.get(item.province) 
          : undefined,
        districtId: item.districtId 
          ? item.districtId 
          : item.district && districtMap.has(item.district) 
          ? districtMap.get(item.district) 
          : undefined,
        municipality: item.municipality,
        ward: item.ward,
        profession: item.profession,
        workspaceId: workspace.id,
        sanitize: args.sanitize,
        groupLabel: item.groupLabel,
        userId: user.id,
      }));
      for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);
        batches.push(batch);
      }
      await Promise.all(
        batches.map(async (batch) => {
          await new SQSProducer().publishEmailRegistryBatch({messages: batch, queueUrl: workspaceResource.credentials.queueUrl, sqsClient: awsSQSClient});
        }),
      );

      return SuccessResponse.send({
        message: 'Email registries is successfully created.',
      });
    },
    createEmailRegistriesWithEmailRegistryGroup: async (
      parent: ParentNode,
      args: { input: InputEmailRegistriesWithEmailRegistryGroupId },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const user = Guard.grant(contextValue.user);
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      let report,
        emailRegistries: EmailRegistryInterface[] = [];
      Validator.check(createEmailRegistriesWithEmailRegistryGroup, args.input);

      if (args.input.emailRegistries) {
        args.input.emailRegistries = args.input.emailRegistries.map((item: InputEmailRegistryInterface) => {
          item.email = item.email.toLowerCase();
          return {
            ...item,
            workspaceId: workspace.id,
          };
        });
        emailRegistries = await new EmailRegistryService(contextValue.models!).bulkCreate(args.input.emailRegistries);
      }

      if (args.input.emailRegistryIds) {
        emailRegistries = await new EmailRegistryService(contextValue.models!).findAll({
          ids: args.input.emailRegistryIds,
          workspaceId: workspace.id,
        });
      }

      if (emailRegistries.length > 0) {
        const payload: InputEmailRegistryEmailRegistryGroupInterface[] = emailRegistries.map((item) => {
          return {
            emailRegistryId: item.id,
            emailRegistryGroupId: args.input.emailRegistryGroupId,
          };
        });
        await new EmailRegistryEmailRegistryGroupService(contextValue.models!).bulkCreate(payload);
      }

      emailRegistries = [... new Set(emailRegistries.filter(item => item.status === EmailRegistryStatusEnum.unsanitized))]

      if (args.input.sanitize && emailRegistries.length > 0) {
       const balance = await CreditHelper.getAvailableBalance({ workspaceId: workspace.id, service: ServiceEnum.bouncer});
        if (balance < emailRegistries.length) {
          return SuccessResponse.send({
            message: `Email registries is successfully created, but you don't have enough credits ko sanitize!!`,
          });
        }
        report = await VerifyEmail.verifyEmails({
          emailRegistries: emailRegistries,
          userId: user.id,
          workspaceId: workspace.id,
          models: contextValue.models!,
          workspaceSecret: workspace.secret
        });
      }

      return SuccessResponse.send({
        message: 'Email registries is successfully created.',
        data: { emailRegistries, report },
      });
    },
  },

  Query: {
    emailRegistries: async (
      parent: ParentNode,
      args: ArgsEmailRegistryInterface,
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

      const { cursorCount, count, rows } = await new EmailRegistryService(contextValue.models!).findAndCountAll({
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
        message: ' Email Registries list is successfully fetched.',
        edges: data,
        pageInfo: pageInfo,
      });
    },
    emailRegistriesFromGroup: async (
      parent: ParentNode,
      args: ArgsEmailRegistryInterface,
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

      const { cursorCount, count, rows } = await new EmailRegistryService(contextValue.models!).findAndCountAll({
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
        message: ' Email Registries list is successfully fetched.',
        edges: data,
        pageInfo: pageInfo,
      });
    },
    emailRegistry: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const data = await new EmailRegistryService(contextValue.models!).findByPk(args.id);

      return SuccessResponse.send({
        message: 'Email registry details is successfully fetched.',
        data: data,
      });
    },
    emailRegistriesCountSummaries: async (
      parent: ParentNode,
      args: InBetweenDateExtend,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      const sanitized = await new EmailRegistryService(contextValue.models!).count({
        workspaceId: workspace.id,
        status: EmailRegistryStatusEnum.sanitized,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const unsanitized = await new EmailRegistryService(contextValue.models!).count({
        workspaceId: workspace.id,
        status: EmailRegistryStatusEnum.unsanitized,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const deliverable = await new EmailRegistryService(contextValue.models!).count({
        workspaceId: workspace.id,
        sanitizedStatus: EmailRegistrySanitizedStatusEnum.deliverable,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const undeliverable = await new EmailRegistryService(contextValue.models!).count({
        workspaceId: workspace.id,
        sanitizedStatus: EmailRegistrySanitizedStatusEnum.undeliverable,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });

      return SuccessResponse.send({
        message: 'Email registry counts is successfully fetched.',
        data: {
          sanitized: sanitized,
          unsanitized: unsanitized,
          deliverable: deliverable,
          undeliverable: undeliverable,
          total: sanitized + unsanitized,
        },
      });
    },
  },
  Subscription: {
    sanitizationEmailRegistries: {
      subscribe: (
        parent: ParentNode,
        args: InputSanitizationEmailRegistries,
        contextValue: ContextInterface,
        info: InformationEvent,
      ) => {
        const user = Guard.grant(contextValue.user);
        const workspace = Guard.grantWorkspace(contextValue.workspace);

        // return IoRedis.RedisIoRedis.asyncIterator([workspace.secret]);
        return;
      },
    },
  },
};
