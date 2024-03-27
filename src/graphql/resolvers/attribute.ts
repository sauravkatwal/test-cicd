import { InformationEvent } from 'http';
import { defaultOrder, defaultSort, pgMaxLimit, pgMinLimit } from '../../config';
import { SuccessResponse } from '../../helpers';
import { ArgsAttributesInterface, ContextInterface, InputAttributeInterface } from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { AttributeService } from '../../services';
import { createAttribute, updateAttribute } from '../../validators';

export const attributeResolvers : any = {
  Mutation: {
    createAttribute: async (
      parent: ParentNode,
      args: { input: InputAttributeInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Validator.check(createAttribute, args.input);

      const data = await new AttributeService().create(args.input);

      return SuccessResponse.send({
        message: 'Attribute is successfully created.',
        data: data,
      });
    },
    updateAttribute: async (
      parent: ParentNode,
      args: { id: number; input: InputAttributeInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Validator.check(updateAttribute, args.input);

      const data = await new AttributeService().updateOne(args.id, args.input);

      return SuccessResponse.send({
        message: 'Attribute is successfully updated.',
        data: data,
      });
    },
    deleteAttribute: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      await new AttributeService().deleteOne(args.id);

      return SuccessResponse.send({
        message: 'Attribute is successfully deleted.',
      });
    },
  },
  Query: {
    attributes: async (
      parent: ParentNode,
      args: ArgsAttributesInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      let { offset, limit, query, sort, order } = args;
      offset = offset && offset > 0 ? offset - 1 : 0;
      limit = limit ? limit : pgMinLimit;
      limit = Math.min(limit, pgMaxLimit);
      query = query ? query : undefined;
      order = order ? order : defaultOrder;
      sort = sort ? sort : defaultSort;

      const { count, rows: data } = await new AttributeService().findAndCountAll({
        offset,
        limit,
        query,
        sort,
        order,
      });

      return SuccessResponse.send({
        message: 'Attributes list is successfully fetched.',
        data: data,
        count: count,
      });
    },
    attribute: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const data = await new AttributeService().findByPk(args.id);

      return SuccessResponse.send({
        message: 'Attribute details is successfully fetched.',
        data: data,
      });
    },
  },
};
