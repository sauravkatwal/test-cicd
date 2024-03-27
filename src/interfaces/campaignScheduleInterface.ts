import * as Sequelize from 'sequelize';

import { ModelTimestampExtend, PaginationOrderSearchExtend, CampaignInterface, InputFallbackStrategyInterface, FallbackStrategyInterface, EmailTemplateInterface, MessagingPlatformInterface } from '.';

import { FallbackTypeEnum, MessagingPlatformEnum, ScheduleStatusEnum } from '../enums';

export interface InputCampaignScheduleInterface {
  workspaceId: Sequelize.CreationOptional<number>;
  campaignId?: Sequelize.CreationOptional<number>;
  scheduleDate: string;
  scheduleTime: string;
  timeZone?: string;
  status?: ScheduleStatusEnum;
  parentId?: number;
  level: number;
  templateId: number;
  cacheTemplateId: number;
  type: FallbackTypeEnum;
  messagingPlatformId?: number;
  messagingPlatform?: MessagingPlatformEnum
  fallbacks?: InputFallbackStrategyInterface[];
  scheduleDateTimeUtc?: string;
}

export interface CampaignScheduleInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  campaignId: Sequelize.CreationOptional<number>;
  scheduleDate: string;
  scheduleTime: string;
  timeZone: string;
  status: string;
  workspaceId?: number;
  campaign?: CampaignInterface;
  parentId?: number;
  level: number;
  templateId: number;
  template?: EmailTemplateInterface;
  cacheTemplateId: number;
  cacheTemplate?: EmailTemplateInterface;
  type: FallbackTypeEnum;
  messagingPlatformId?: number;
  messagingPlatform?: MessagingPlatformInterface
  fallbacks?: FallbackStrategyInterface[];
  scheduleDateTimeUtc?: string;
  sentCount?: number;
}

export interface ArgsCampaignScheduleInterface extends PaginationOrderSearchExtend {
  workspaceId: number;
  campaignId: number;
}

export interface CampaignScheduleModelInterface extends Sequelize.Model<CampaignScheduleInterface, Partial<InputCampaignScheduleInterface>>,
  CampaignScheduleInterface { }
