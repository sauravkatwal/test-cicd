import { InformationEvent } from 'http';
import { CreditHelper, CursorPagination, Helper, SuccessResponse } from '../../helpers';
import {
  ArgsWorkspaceInterface,
  ArgsWorkspaceMembersInterface,
  ContextInterface,
  InBetweenDateExtend,
  InputTransactionInterface,
  InputUserInterface,
  UserInterface,
  WorkspaceInterface,
  WorkspaceVerificationInterface,
} from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import {
  AddressService,
  CompanyService,
  PointOfContactService,
  ServiceRateService,
  TransactionService,
  UserService,
  UserWorkspaceService,
  WorkspaceService,
} from '../../services';
import { createWorkspace, updateWorkspace } from '../../validators';

import KSUID from 'ksuid';
import { ServiceEnum, UserWorkspaceStatusEnum } from '../../enums';

export const workspaceResolvers = {
  Mutation: {
    adminRegisterWorkspace: async (
      parent: ParentNode,
      args: { input: InputUserInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);
      Validator.check(createWorkspace, args.input);
      let user: UserInterface, workspace: WorkspaceInterface, company;
      try {
        try {
          user = await new UserService().create(args.input);
          try {
            workspace = await new WorkspaceService().create({
              label: args.input.companyInfo?.name!,
              owner_id: user.id,
              dbDatabase: 'postgres',
              dbUsername: 'postgres',
              dbHost: 'localhost',
              dbPassword: 'postgres',
              dbPort: 5432,
              dbDialect: 'postgres',
              dbLogging: false,
            });
            try {
              args.input.companyInfo!.workspace_id = workspace.id;
              args.input.companyInfo!.user_id = user.id;
              args.input.pointOfContact!.workspaceId = workspace.id;

              company = await new CompanyService().create(args.input.companyInfo!);
              await new PointOfContactService().create(args.input.pointOfContact!);
            } catch (error: any) {
              if (company) {
                await new CompanyService().deleteOne(company.id);
              }
              if (workspace) {
                await new WorkspaceService().deleteOne(workspace.id);
              }
              console.error(error.message);
              throw Error(error.message);
            }
          } catch (error: any) {
            if (user) {
              await new UserService().deleteOne(user.id);
            }
            console.error(error.message);
            throw Error(error.message);
          }
        } catch (error: any) {
          console.error(error.message);
          throw Error(error.message);
        }

        if (args.input.services && args.input.services.length > 0) {
          const transactions = args.input.services.map(async (service) => {
            const transactionInput: InputTransactionInterface = {
              workspaceId: workspace.id,
              transactionById: user.id,
              transactionDate: new Date(),
              credit: service.credit,
              transactionCode: KSUID.randomSync().string,
              service: service.service,
            };
            await new ServiceRateService().create({
              amount: service.serviceRate!,
              workspaceId: workspace.id,
              service: service.service!,
            });
            return await new TransactionService().create(transactionInput);
          });
          await Promise.all([transactions]);
        }
        const userWorkspace = await new UserWorkspaceService().findOne({
          user_id: user!.id,
        });
        await Helper.sendInvitationLink({
          email: user!.email,
          userWorkspaceId: userWorkspace.id,
          subject: 'Admin Registration',
        });

        return SuccessResponse.send({
          message: 'Workspace is successfully registered.',
        });
      } catch (error: any) {
        console.error(error);
        throw new Error(error);
      }
    },
    adminAddCreditToWorkspace: async (
      parent: ParentNode,
      args: { workspaceId: number; input: InputTransactionInterface[] },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const user = Guard.grantAdmin(contextValue.user);
      const transactions = args.input.map(async (item) => {
        const transactionInput: InputTransactionInterface = {
          workspaceId: args.workspaceId,
          transactionById: user.id,
          transactionDate: new Date(),
          credit: item.credit,
          transactionCode: KSUID.randomSync().string,
          service: item.service,
        };
        return await new TransactionService().create(transactionInput);
      });
      await Promise.all([transactions]);

      return SuccessResponse.send({
        message: 'Credits are added successfully.',
      });
    },
    adminUpdateWorkspace: async (
      parent: ParentNode,
      args: { workspaceId: number; input: InputUserInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const admin = Guard.grantAdmin(contextValue.user);
      Validator.check(updateWorkspace, args.input);

      await Promise.all([
        new AddressService().updateOne(args.input.companyInfo?.address!, args.workspaceId),
        new PointOfContactService().update({ workspaceId: args.workspaceId, input: args.input.pointOfContact! }),
      ]);

      if (args.input.services && args.input.services.length > 0) {
        const transactions = args.input.services.map(async (service) => {
          const transactionInput: InputTransactionInterface = {
            workspaceId: args.workspaceId,
            transactionById: admin.id,
            transactionDate: new Date(),
            credit: service.credit,
            transactionCode: KSUID.randomSync().string,
            service: service.service,
          };
          await new ServiceRateService().create({
            amount: service.serviceRate!,
            workspaceId: args.workspaceId,
            service: service.service!,
          });
          return await new TransactionService().create(transactionInput);
        });
        await Promise.all(transactions);
      }

      return SuccessResponse.send({
        message: 'Admin is successfully updated.',
      });
    },
    adminDeleteWorkspace: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);
      await new WorkspaceService().deleteOne(args.id);

      return SuccessResponse.send({
        message: 'Workspace deleted successfully',
      });
    },
    adminSqlQueryTenant: async (
      parent: ParentNode,
      args: { sql: string },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);
      // return TenantDatabase.sequelize.query(args.sql);
    },
  },
  Query: {
    userWorkspaceStatusCountSummaries: async (
      parent: ParentNode,
      args: InBetweenDateExtend,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      const accepted = await new UserWorkspaceService().count({
        workspaceId: workspace.id,
        userWorkspaceStatus: UserWorkspaceStatusEnum.accepted,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const deactivated = await new UserWorkspaceService().count({
        workspaceId: workspace.id,
        userWorkspaceStatus: UserWorkspaceStatusEnum.deactivated,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const pending = await new UserWorkspaceService().count({
        workspaceId: workspace.id,
        userWorkspaceStatus: UserWorkspaceStatusEnum.pending,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      const response = [
        { status: UserWorkspaceStatusEnum.accepted, count: accepted },
        { status: UserWorkspaceStatusEnum.deactivated, count: deactivated },
        { status: UserWorkspaceStatusEnum.pending, count: pending },
        { status: 'total', count: accepted + deactivated + pending },
      ];

      return SuccessResponse.send({
        message: 'Members Counts is successfully fetched.',
        data: response.map(({ status, count }) => ({ status: status, count: count })),
      });
    },
    adminWorkspaces: async (
      parent: ParentNode,
      args: ArgsWorkspaceInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);

      const { cursor, limit, order, sort, cursorSort, cursorOrder, query } = CursorPagination.getCursorQuery({
        before: args.before,
        last: args.last,
        after: args.after,
        first: args.first,
        query: args.query,
        sort: args.sort,
        order: args.order,
      });
      const { count, cursorCount, rows } = await new WorkspaceService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorSort,
        cursorOrder,
        query,
      });
      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: 'Workspace list is successfully fetched.',
        edges: data,
        pageInfo: pageInfo,
      });
    },
    adminWorkspace: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);
      const data = await new WorkspaceService().findByPk(args.id);
      const servicesAvailable: any = await new TransactionService().availableServices({ workspaceId: args.id });
      let services: {
        service: ServiceEnum;
        availableBalance: number;
        serviceRate: number;
      }[] = [];
      if (servicesAvailable) {
        const response = servicesAvailable.map(async (service: any) => {
          const serviceRate = await new ServiceRateService().findOne({
            service: service.service!.slug as ServiceEnum,
            workspaceId: args.id,
          });
          const data = {
            service: service.service!.slug as ServiceEnum,
            availableBalance: Number(service.dataValues.availableBalance!),
            serviceRate: serviceRate.amount,
          };
          services.push(data);
        });
        await Promise.all(response);
        data.services = services;
      }

      return SuccessResponse.send({
        message: 'User details is successfully fetched.',
        data: data,
      });
    },
    workspaceCredits: async (
      parent: ParentNode,
      args: ArgsWorkspaceMembersInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      let currentBalance: any = await new TransactionService().availableBalance({
        workspaceId: workspace.id,
        service: args.service!,
      });
      currentBalance = currentBalance[0] ? currentBalance[0].dataValues.availableBalance : 0;
      const availableBalance = await CreditHelper.getAvailableBalance({
        workspaceId: workspace.id,
        service: args.service!,
      });

      return SuccessResponse.send({
        message: 'Balance Count is successfully fetched.',
        data: { currentBalance, availableBalance },
      });
    },
    adminCreditsUsageSummary: async (
      parent: ParentNode,
      args: ArgsWorkspaceInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);

      let { workspaceId, fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      const result = await new WorkspaceService().getCreditsUsageSummary({
        workspaceId: workspaceId!,
        fromDate,
        toDate,
      });

      return SuccessResponse.send({
        message: 'Credits usage summary is successfully fetched.',
        data: result,
      });
    },
    adminCreditsUsageDetails: async (
      parent: ParentNode,
      args: ArgsWorkspaceInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);

      let { workspaceId, fromDate, toDate, service } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      const result = await new WorkspaceService().getCreditsUsageDetails({
        workspaceId: workspaceId!,
        fromDate,
        toDate,
        service: service!,
      });
      const serviceRate = await new ServiceRateService().findOne({
        service: service!,
        creditUnit: 1,
        workspaceId: workspaceId!,
      });
      result.map((item) => {
        item.cost = item.used_credits * serviceRate.amount;
      });

      return SuccessResponse.send({
        message: 'Credits usage details is successfully fetched.',
        data: result,
      });
    },

    adminVerifyRegistrationInput: async (
      parent: ParentNode,
      args: WorkspaceVerificationInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantAdmin(contextValue.user);

      const { email, phoneNumber, companyName, companyRegNo } = args;
      if (email) {
        await Helper.checkAndThrowError(new UserService(), 'email', email, 'Email');
      } else if (phoneNumber) {
        await Helper.checkAndThrowError(new UserService(), 'phoneNumber', phoneNumber, 'Phone Number');
      } else if (companyName) {
        await Helper.checkAndThrowError(new CompanyService(), 'name', companyName, 'Company Name');
      } else if (companyRegNo) {
        await Helper.checkAndThrowError(new CompanyService(), 'companyRegNo', companyRegNo, 'Registration Number');
      }

      return SuccessResponse.send({
        message: 'User Input is Verified Successfully!!',
      });
    },

    creditsUsageSummary: async (
      parent: ParentNode,
      args: ArgsWorkspaceInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      let { fromDate, toDate } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      const result = await new WorkspaceService().getCreditsUsageSummary({
        workspaceId: workspace.id,
        fromDate,
        toDate,
      });
      return SuccessResponse.send({
        message: 'Credits usage summary is successfully fetched.',
        data: result,
      });
    },

    creditsUsageDetails: async (
      parent: ParentNode,
      args: ArgsWorkspaceInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);

      let { fromDate, toDate, service } = args;
      fromDate = fromDate || new Date(1990);
      toDate = toDate || new Date(Date.now());
      const result = await new WorkspaceService().getCreditsUsageDetails({
        workspaceId: workspace.id,
        fromDate,
        toDate,
        service: service!,
      });
      const serviceRate = await new ServiceRateService().findOne({
        service: service!,
        creditUnit: 1,
        workspaceId: workspace.id,
      });
      result.map((item) => {
        item.cost = item.used_credits * serviceRate.amount;
      });

      return SuccessResponse.send({
        message: 'Credits usage details is successfully fetched.',
        data: result,
      });
    },
  },
};
