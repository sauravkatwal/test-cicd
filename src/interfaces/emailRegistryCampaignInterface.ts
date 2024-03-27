import * as Sequelize from 'sequelize';

import { InBetweenDateExtend, CampaignClickEventInterface, CampaignInterface, CursorPaginationOrderSearchExtend, EmailRegistryInterface, ModelTimestampExtend, PaginationOrderSearchExtend } from '../interfaces';

export interface InputEmailRegistryCampaignInterface {
  email_registry_id: Sequelize.CreationOptional<number>;
  email_registry_group_id?: Sequelize.CreationOptional<number>;
  campaign_id?: Sequelize.CreationOptional<number>;
  is_deliverable?: boolean;
  sparrowSmsMessageId?: string;
  sparrowViberBatchId?: string;
  aws_ses_message_id?: string;
}

export interface EmailRegistryCampaignInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  email_registry_id: Sequelize.CreationOptional<number>;
  email_registry?: EmailRegistryInterface;
  email_registry_group_id?: Sequelize.CreationOptional<number>;
  campaign_id?: Sequelize.CreationOptional<number>;
  campaign?: CampaignInterface;
  is_deliverable?: boolean;
  aws_ses_message_id?: string;
  sparrowSmsMessageId?: string;
  sparrowViberBatchId: string;
  campaignClickEvents?: CampaignClickEventInterface[];
  created_at?: Date;
}

export interface ArgsEmailRegistryCampaignInterface extends CursorPaginationOrderSearchExtend, InBetweenDateExtend {
  campaign_id?: number;
  email_registry_group_id?: number;
  email_registry_id?: number; 
}

export interface EmailRegistryCampaignModelInterface
  extends Sequelize.Model<
      EmailRegistryCampaignInterface,
      Partial<InputEmailRegistryCampaignInterface>
    >,
    EmailRegistryCampaignInterface {}
