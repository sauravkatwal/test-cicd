import * as Sequelize from 'sequelize';
import { ModelCreatorIdExtend, WorkspaceArgsExtend } from '.';

export interface InputCacheEmailTemplateInterface {
  name: string;
  content: object;
  content_html: string;
  description?: string;
  workspace_id: Sequelize.CreationOptional<number>;
}

export interface CacheEmailTemplateInterface extends ModelCreatorIdExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  content: object;
  content_html: string;
  description: string;
  workspace_id : Sequelize.CreationOptional<number>;
}

export interface CacheEmailTemplateModelInterface
  extends Sequelize.Model<CacheEmailTemplateInterface, Partial<InputCacheEmailTemplateInterface>>,
    CacheEmailTemplateInterface {}
