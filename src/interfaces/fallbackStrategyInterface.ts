import * as Sequelize from 'sequelize';
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend, WorkspaceExtend, MessagingPlatformInterface, CampaignInterface, EmailTemplateInterface } from '.';
import { FallbackTypeEnum, MessagingPlatformEnum, ScheduleStatusEnum } from '../enums';

export interface InputFallbackStrategyInterface extends WorkspaceExtend {
  workspaceId: Sequelize.CreationOptional<number>;
  campaignId?: Sequelize.CreationOptional<number>;
  scheduleDate: string;
  scheduleTime: string;
  fallbackStrategy: InputFallbackStrategyInterface[];
  parentId?: number;
  level: number;
  templateId: number;
  cacheTemplateId: number;
  timeZone?: string;
  type: FallbackTypeEnum;
  messagingPlatformId?: number;
  messagingPlatform?: MessagingPlatformEnum;
  scheduleDateTimeUtc?: string;
}

export interface FallbackStrategyInterface extends ModelTimestampExtend, WorkspaceExtend {
  id: Sequelize.CreationOptional<number>;
  campaignId: Sequelize.CreationOptional<number>;
  scheduleDate: string;
  scheduleTime: string;
  timeZone: string;
  workspaceId: number;
  campaign?: CampaignInterface;
  parentId?: number;
  level: number;
  templateId: number;
  template?: EmailTemplateInterface;
  cacheTemplateId: number;
  cacheTemplate?: EmailTemplateInterface;
  type: FallbackTypeEnum;
  messagingPlatformId?: number;
  messagingPlatform?: MessagingPlatformInterface;
  scheduleDateTimeUtc?: string;
}

export interface FallbackStrategyModelInterface
  extends Sequelize.Model<Partial<FallbackStrategyInterface>, Partial<InputFallbackStrategyInterface>>,
    FallbackStrategyInterface {}

export interface ArgsFallbackStrategyInterface extends CursorPaginationOrderSearchExtend {}
