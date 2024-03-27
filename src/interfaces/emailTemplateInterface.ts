import * as Sequelize from 'sequelize';
import {
  ModelCreatorIncludeExtend,
  ModelTimestampExtend,
  WorkspaceArgsExtend,
  ModelCreatorIdExtend,
  CursorPaginationOrderSearchExtend,
  CampaignScheduleInterface,
} from '.';

import { MessagingPlatformEnum,EmailTemplateApprovedStatus } from '../enums';

export interface InputEmailTemplateInterface extends ModelCreatorIdExtend {
  name: string;
  slug?: string;
  messagingPlatform: MessagingPlatformEnum
  content: Object | any;
  content_html?: Object | any;
  description: string;
  workspace_id: Sequelize.CreationOptional<number>;
  status?:string;
  approvedStatus?: EmailTemplateApprovedStatus;
  templateCode?: string;
}

export interface EmailTemplateInterface extends ModelTimestampExtend, ModelCreatorIncludeExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  slug: string;
  messagingPlatform: MessagingPlatformEnum
  content: Object | any;
  content_html: Object | any;
  description: string;
  workspace_id: Sequelize.CreationOptional<number>;
  status :string;
  approvedStatus: EmailTemplateApprovedStatus;
  templateCode: string;
  campaignSchedule?: CampaignScheduleInterface[];
  updateDeleteEnabled?: boolean
}

export interface ArgsEmailTemplateInterface extends CursorPaginationOrderSearchExtend, WorkspaceArgsExtend {
  messagingPlatform?: MessagingPlatformEnum;

}

export interface InputSendSampleEmailTemplateInterface {
  destination: string;
  subject: string;
  content:  Object | any;
}

export interface EmailTemplateModelInterface extends Sequelize.Model<EmailTemplateInterface,
    Partial<InputEmailTemplateInterface>>,

    InputEmailTemplateInterface {}