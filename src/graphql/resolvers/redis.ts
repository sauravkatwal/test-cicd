import { InformationEvent } from 'http';
import { SuccessResponse } from '../../helpers';
import { ContextInterface, InputCacheInterface } from '../../interfaces';
import { Guard } from '../../middlewares';
import { RedisService } from '../../services/redisService';

export const redisResolver = {
  Mutation: {
    createCache: async (
      parent: ParentNode,
      args: { input: InputCacheInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      args.input.email = user.email;
      await new RedisService().create(args.input);
      return SuccessResponse.send({
        message: 'Cache is successfully created.',
      });
    },
    removeCache: async (
      parent: ParentNode,
      args: { input: InputCacheInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      args.input.email = user.email;
      await new RedisService().remove(args.input);
      return SuccessResponse.send({
        message: 'Cache is successfully removed.',
      });
    },
  },
  Query: {
    getCache: async (
      parent: ParentNode,
      args: { input: InputCacheInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grantWorkspace(contextValue.workspace);
      const user = Guard.grant(contextValue.user);
      args.input.email = user.email;
      const [data] = await new RedisService().find(args.input);
      return SuccessResponse.send({
        message: 'Cache is successfully fetched.',
        data: data,
      });
    },
  },
};
