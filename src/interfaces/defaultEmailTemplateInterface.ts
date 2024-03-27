import * as Sequelize from 'sequelize';
import { ModelCreatorIdExtend, ModelCreatorIncludeExtend, ModelTimestampExtend, PaginationOrderSearchExtend } from '.';
import { MessagingPlatformEnum } from '../enums';
export interface InputDefaultEmailTemplateInterface extends ModelCreatorIdExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  messagingPlatform: MessagingPlatformEnum;
  slug?: string;
  content: Object | any;
  content_html?: object | any;
  description: string;
  status?:string;
}

export interface DefaultEmailTemplateInterface extends ModelTimestampExtend, ModelCreatorIncludeExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  slug: string;
  messagingPlatform: MessagingPlatformEnum;
  content: Object | any;
  content_html?: Object | any;
  description: string;
  status: string;
}

export interface ArgsDefaultEmailTemplateInterface extends PaginationOrderSearchExtend {
  messagingPlatform?: MessagingPlatformEnum;
 }
