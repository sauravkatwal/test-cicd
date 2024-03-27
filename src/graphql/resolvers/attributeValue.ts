import { InformationEvent } from 'http';
import { defaultOrder, defaultSort, pgMaxLimit, pgMinLimit } from '../../config';
import { SuccessResponse } from '../../helpers';
import { ArgsAttributeValuesInterface, ContextInterface, InputAttributeValueInterface } from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { AttributeValueService } from '../../services';
import { createAttributeValue, updateAttributeValue } from '../../validators';

export const attributeValueResolvers = {
  Mutation: {
    createAttributeValue: async (
      parent: ParentNode,
      args: { input: InputAttributeValueInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Validator.check(createAttributeValue, args.input);

      const data = await new AttributeValueService().create(args.input);

      return SuccessResponse.send({
        message: 'Attribute value is successfully created.',
        data: data,
      });
    },
    updateAttributeValue: async (
      parent: ParentNode,
      args: { id: number; input: InputAttributeValueInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Validator.check(updateAttributeValue, args.input);

      const data = await new AttributeValueService().updateOne(args.id, args.input);

      return SuccessResponse.send({
        message: 'Attribute Value is successfully updated.',
        data: data,
      });
    },
    deleteAttributeValue: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      await new AttributeValueService().deleteOne(args.id);

      return SuccessResponse.send({
        message: 'Attribute value is successfully deleted.',
      });
    },
  },
  Query: {
    attributeValues: async (
      parent: ParentNode,
      args: ArgsAttributeValuesInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      // Guard.grant(contextValue.user);
      let { offset, limit, query, sort, order, attributeId, attributeName } = args;
      offset = offset && offset > 0 ? offset - 1 : 0;
      limit = limit ? limit : pgMinLimit;
      limit = Math.min(limit, pgMaxLimit);
      query = query ? query : undefined;
      order = order ? order : defaultOrder;
      sort = sort ? sort : defaultSort;
      attributeId = attributeId ? attributeId : undefined;
      attributeName = attributeName ? attributeName : undefined;

      const { count, rows: data } = await new AttributeValueService().findAndCountAll({
        offset,
        limit,
        query,
        sort,
        order,
        attributeId,
        attributeName,
      });

      return SuccessResponse.send({
        message: 'Attribute value list is successfully fetched.',
        data: data,
        count: count,
      });
    },
    attributeValue: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const data = await new AttributeValueService().findByPk(args.id);

      return SuccessResponse.send({
        message: 'Attribute value details is successfully fetched.',
        data: data,
      });
    },
  },
};
