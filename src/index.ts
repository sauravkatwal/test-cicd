import { ApolloServer, BaseContext } from '@apollo/server';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload';
import { GraphQLFormattedError } from 'graphql';
import http, { IncomingMessage } from 'http';
import { environment, port } from './config';
import { EnvironmentEnum } from './enums';
import { typeDefs, resolvers } from './graphql/schema';
import {
  ContextInterface,
  UserInterface,
  WorkspaceInterface,
  ModelsInterface
} from './interfaces';
import { Guard, Tenant } from './middlewares';
import { Database } from './config/instance';
import { RedisInstance } from './config';

class Server {
  app: express.Application;
  constructor() {
    this.app = express();
  }

  private async connectDB() {
    await Database.connection();
  }

  private async connectRedis() {
    await RedisInstance.connection();
  }

  public async start() {
    this.connectDB();
    this.connectRedis();
    this.configuration();
    const httpServer = http.createServer(this.app);

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
      ],
    });

    await server.start();

    this.app.use(
      '/',

      cors<cors.CorsRequest>({ origin: 'localhost:8081' }),
      bodyParser.json({ limit: '10mb' }),
      graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
      expressMiddleware(server, {
        context: async ({ req }: { req: IncomingMessage }): Promise<ContextInterface> => {
          const token = req.headers.authorization as string;
          const secret = req.headers?.['x-workspace-secret-id'] as string;

          let workspace: WorkspaceInterface | undefined, user: UserInterface | undefined,
            models: ModelsInterface | undefined;

          if (secret) {
            workspace = await Guard.checkWorkspace(secret);
            models = await Tenant.connectTenantDB(workspace);
          }
          if (token) {
            user = await Guard.auth(token.replace('Bearer ', ''), workspace);
          }

          return {
            token,
            workspace,
            user,
            models,
          };
        },
      }),
    );

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    await new Promise<void>((resolve) => {
      const port = this.app.get('port');
      httpServer.listen({ port: port }, resolve);
      console.info(`🚀  Server ready at: http://localhost:${port}`);
    });
  }

  private configuration() {
    this.app.set('port', port);
  }
}

const server = new Server();
server.start();
