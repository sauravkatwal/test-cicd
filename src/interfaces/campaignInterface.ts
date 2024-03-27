import * as Sequelize from 'sequelize';
import { CampaignApprovedStatus, MessagingPlatformEnum, ScheduleStatusEnum } from '../enums';

import {
  CampaignScheduleInterface,
  CursorPaginationOrderSearchExtend,
  EmailRegistryCampaignInterface,
  EmailRegistryInterface,
  InBetweenDateExtend,
  InputCampaignScheduleInterface,
  InputEmailRegistryCampaignInterface,
  ModelTimestampExtend,
  PaginationOrderSearchExtend,
} from '.';

export interface InputCampaignInterface {
  name: string;
  description: string;
  replyEmail: string;
  fromEmail?: string;
  plainText: string;
  query: string;
  trackingOpen: boolean;
  trackingClick: boolean;
  trackingDeliver: boolean;
  workspaceId: number;
  emailRegistryGroups: number[];
  emailRegistryGroupCampaigns: number[];
  emailRegistries: number[];
  emailRegistryCampaigns: InputEmailRegistryCampaignInterface[];
  module: string;
  isArchive: boolean;
  subject: string;
  schedule: InputCampaignScheduleInterface;
  approvedStatus?: CampaignApprovedStatus;
}

export interface CampaignInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  description: string;
  replyEmail: string;
  fromEmail: string;
  plainText: string;
  query: string;
  trackingOpen: boolean;
  trackingClick: boolean;
  trackingDeliver: boolean;
  workspaceId: number;
  emailRegistryReceipts?: EmailRegistryInterface[];
  emailRegistryCampaigns?: EmailRegistryCampaignInterface[];
  isArchive: boolean;
  subject: string;
  createdAt?: Date;
  receipts?: ReceiptInterface;
  summary?: CampaignEmailsSummaryInterface
  approvedStatus: CampaignApprovedStatus;
  schedule?: CampaignScheduleInterface;
}

export interface CampaignEmailsSummaryInterface {
  emailRegistryCount: number;
  emailOpenCount: number;
  emailClickCount: number;
  createdAt?: Date;
}

export interface ReceiptInterface {
  emailRegistries: number[];
  emailRegistryGroups: number[];
}

export interface InputCampaignEmailRegistryGroupInterface {
  emailRegistryGroupId: number[];
}

export interface ArgsCampaignInterface extends CursorPaginationOrderSearchExtend {
  workspaceId: number;
  status?: ScheduleStatusEnum;
  isArchive?: boolean;
}

export interface ArgsCampaignEmailReportCountInterface extends InBetweenDateExtend, PaginationOrderSearchExtend {
  campaignId: number;
  reportType: string;
  trackingType: string;
  fallbackLevel: string;
  messagingPlatform: MessagingPlatformEnum;
  query: string;
}



export interface CampaignModelInterface extends Sequelize.Model<CampaignInterface, Partial<InputCampaignInterface>>, CampaignInterface { }