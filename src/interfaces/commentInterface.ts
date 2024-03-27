import * as Sequelize from 'sequelize';
import { ModelTimestampExtend, CursorPaginationOrderSearchExtend, UserWorkspaceInterface } from '.';

export interface InputCommentInterface {
  campaignId?: number;
  emailTemplateId?: number;
  comment: string;
  workspaceId: Sequelize.CreationOptional<number>;
  createdById?: Sequelize.CreationOptional<number>;
}

export interface CommentInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  campaignId?: number;
  emailTemplateId?: number;
  comment: string;
  workspaceId: Sequelize.CreationOptional<number>;
  createdById?: Sequelize.CreationOptional<number>;
  userWorkspace?: UserWorkspaceInterface;
}

export interface CommentModelInterface
  extends Sequelize.Model<Partial<CommentInterface>, Partial<InputCommentInterface>>,
    CommentInterface {}

export interface ArgsCommentInterface extends CursorPaginationOrderSearchExtend {
  campaignId?: number;
  emailTemplateId?: number;
}
