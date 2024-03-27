import { InformationEvent } from 'http';
import { defaultOrder, defaultSort, pgMaxLimit, pgMinLimit } from '../../config';
import { SuccessResponse } from '../../helpers';
import {
  ArgsDefaultEmailTemplateInterface,
  ContextInterface,
  DefaultEmailTemplateInterface,
  InputDefaultEmailTemplateInterface,
} from '../../interfaces';
import { Guard, Validator } from '../../middlewares';
import { DefaultEmailTemplateService,EmailTemplateService } from '../../services';
import { createEmailTemplate, updateEmailTemplate } from '../../validators';
import { Whatsapp} from '../../utils';
import {MessagingPlatformEnum } from '../../enums';

export const defaultEmailTemplateResolvers = {
  Mutation: {
    createDefaultEmailTemplate: async (
      parent: ParentNode,
      args: { input: InputDefaultEmailTemplateInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Validator.check(createEmailTemplate, args.input);
      switch (args.input.messagingPlatform) {
        case MessagingPlatformEnum.whatsapp:
          const whatsAppInput = {
            name: args.input.name,
            language: "en",
            category: "MARKETING",
           components: args.input.content.components
          };
          const response = await Whatsapp.createWhatsappTemplate(whatsAppInput);
          if(response.data.error) throw new Error(response.data.error.error_user_msg);
        }
      const data = await new DefaultEmailTemplateService().create(args.input);
      return SuccessResponse.send({
        message: 'Default  template is successfully created.',
        data: data,
      });
    },
    updateDefaultEmailTemplate: async (
      parent: ParentNode,
      args: { id: number; input: InputDefaultEmailTemplateInterface },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      Validator.check(updateEmailTemplate, args.input);
      const data = await new DefaultEmailTemplateService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: 'Default  template is successfully updated.',
        data: data,
      });
    },
    deleteDefaultEmailTemplate: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      await new DefaultEmailTemplateService().deleteOne(args.id);
      return SuccessResponse.send({
        message: 'Default  template is successfully deleted.',
      });
    },
  },
  Query: {
    defaultEmailTemplates: async (
      parent: ParentNode,
      args: ArgsDefaultEmailTemplateInterface,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
   
      
      let { offset, limit, query, sort, order, messagingPlatform } = args;
      offset = offset && offset > 0 ? offset - 1 : 0;
      limit = limit ? limit : pgMinLimit;
      limit = Math.min(limit, pgMaxLimit);
      query = query ? query : undefined;
      order = order ? order : defaultOrder;
      sort = sort ? sort : defaultSort;
      messagingPlatform = messagingPlatform ? messagingPlatform : undefined;

      const { count, rows: data } = await new DefaultEmailTemplateService().findAndCountAll({
        offset,
        limit,
        query,
        sort,
        order,
        messagingPlatform
      });

      switch (messagingPlatform) {
        case MessagingPlatformEnum.whatsapp:
          const response = 
            data.map(async(item) => {
              const template = await Whatsapp.getOneWhatsappTemplates({name: item.name})
              item.status = template.data[0].status;
              await new EmailTemplateService(contextValue.models!).update({id: item.id, input:  {status: item.status}})
            });
          await Promise.all(response);
      }
      const response = data.map((item: DefaultEmailTemplateInterface) => {
        return {
          id: item.id,
          name: item.name,
          content: item.content,
          content_html: item.content_html,
          created_at: item.createdAt,
          updated_at: item.updatedAt,
          description: item.description,
          status: item.status,
          messagingPlatform: item.messagingPlatform
        };
      });

      return SuccessResponse.send({
        message: 'Default  templates list is successfully fetched.',
        data: response,
        count: count,
      });
    },
    defaultEmailTemplate: async (
      parent: ParentNode,
      args: { id: number },
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      Guard.grant(contextValue.user);
      const data = await new DefaultEmailTemplateService().findByPk(args.id);
      return SuccessResponse.send({
        message: 'Default  template details is successfully fetched.',
        data: data,
      });
    },
  },
};
