import * as Sequelize from 'sequelize';
import { CacheEmailTemplateModelInterface } from '../../interfaces'

export default (sequelize: Sequelize.Sequelize) => {
  const CacheEmailTemplate = sequelize.define<CacheEmailTemplateModelInterface>(
    'cache_email_templates',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      content_html: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id',
        },
      }
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );
  return CacheEmailTemplate;
};
