import * as Sequelize from 'sequelize';
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, WorkspaceExtend, MessagingPlatformInterface } from '.';
import { MessagingPlatformEnum } from '../enums';

export interface InputCampaignClickEventInterface extends WorkspaceExtend {
  emailRegistryCampaignId: Sequelize.CreationOptional<number>;
  event: string;
  count: number;
  workspaceId: Sequelize.CreationOptional<number>;
  messagingPlatformId?: Sequelize.CreationOptional<number>;
  messagingPlatform?: MessagingPlatformEnum
  link?: string;
  service: string;
}

export interface CampaignClickEventInterface extends ModelTimestampExtend, WorkspaceExtend {
  id: Sequelize.CreationOptional<number>;
  emailRegistryCampaignId: Sequelize.CreationOptional<number>;
  event: string;
  count: number;
  workspaceId: Sequelize.CreationOptional<number>;
  messagingPlatformId: Sequelize.CreationOptional<number>;
  link: string;
  service: string;
}

export interface CampaignClickEventModelInterface
  extends Sequelize.Model<Partial<CampaignClickEventInterface>, Partial<InputCampaignClickEventInterface>>,
    CampaignClickEventInterface {}

export interface ArgsCampaignClickEventInterface extends CursorPaginationOrderSearchExtend {}
