import * as Sequelize from 'sequelize';
import { CommentModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const Comment = sequelize.define<CommentModelInterface>(
    'comments',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      campaignId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'campaigns',
          key: 'id',
        },
        field: 'campaign_id',
      },
      emailTemplateId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'email_templates',
          key: 'id',
        },
        field: 'email_template_id',
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id',
        },
        field: 'workspace_id',
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user_workspaces',
          key: 'id',
        },
        field: 'created_by_id',
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: false,
          name: 'comment_campaign_id',
          fields: ['campaign_id'],
          where: {
            deletedAt: null,
          },
        },
      ],
    },
  );
  return Comment;
};

