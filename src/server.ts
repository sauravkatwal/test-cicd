import { ApolloServer, BaseContext } from '@apollo/server';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import serverlessExpress from '@vendia/serverless-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { GraphQLFormattedError } from 'graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import http from 'http';
import { Database, RedisInstance, environment } from './config';
import { EnvironmentEnum } from './enums';
import { resolvers, typeDefs } from './graphql/schema';
import { ContextInterface, ModelsInterface, UserInterface, WorkspaceInterface } from './interfaces';
import { Guard, Tenant } from './middlewares';
import { NodeCron } from './utils';
import { emailRegistriesSQSConsumer } from './consumers';

Database.connection();
RedisInstance.connection();

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<BaseContext>({
  typeDefs: typeDefs,
  resolvers: resolvers,
  introspection: true,
  csrfPrevention: false,
  cache: 'bounded',
  formatError: (formattedError: GraphQLFormattedError) => {
    if (formattedError.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
      return {
        ...formattedError,
        message: "Your query doesn't match the schema. Try double-checking it!",
      };
    }
    if (formattedError.extensions?.code === ApolloServerErrorCode.BAD_USER_INPUT) {
      return {
        ...formattedError,
        message: "Invalid Input Format. Try double-checking it!",
      };
    }
    return formattedError;
  },
  plugins: [
    ApolloServerPluginCacheControl({
      defaultMaxAge: 1,
      calculateHttpHeaders: false,
    }),
    environment === EnvironmentEnum.production
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageLocalDefault(),
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
});

server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();

app.use(
  cors<cors.CorsRequest>({ origin: [] }),
  bodyParser.json({ limit: '10mb' }),
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  expressMiddleware(server, {
    context: async ({ req }: { req: express.Request }): Promise<ContextInterface> => {
      const token = req.headers.authorization as string;
      const secret = req.headers?.['x-workspace-secret-id'] as string;

      let workspace: WorkspaceInterface | undefined,
        user: UserInterface | undefined,
        models: ModelsInterface | undefined;

      if (secret) {
        workspace = await Guard.checkWorkspace(secret);
        models = await Tenant.connectTenantDB(workspace)
      }
      if (token) {
        user = await Guard.auth(token.replace('Bearer ', ''), workspace);
      }

      return {
        workspace,
        user,
        token,
        models
      };
    },
  }),
);

exports.graphqlHandler = serverlessExpress({ app });

exports.cronHandler = async (event: any, context: any) => {
  await NodeCron.updateEmailRegistryStatus();
  return context.logStreamName;
};

exports.emailRegistryConsumer = async (event: any, context: any) => {
  await emailRegistriesSQSConsumer(event, context);
  return context.logStreamName;
}
