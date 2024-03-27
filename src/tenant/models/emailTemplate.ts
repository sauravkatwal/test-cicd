import * as Sequelize from 'sequelize';
import { EmailTemplateApprovedStatus, MessagingPlatformEnum } from '../../enums';
import { EmailTemplateModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const EmailTemplate = sequelize.define<EmailTemplateModelInterface>(
    'email_templates',
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
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      messagingPlatform: {
        field: 'messaging_platform',
        type: Sequelize.ENUM(
          MessagingPlatformEnum.email,
          MessagingPlatformEnum.whatsapp,
          MessagingPlatformEnum.viber,
          MessagingPlatformEnum.sms,
        ),
        allowNull: false,
      },
      content_html: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id',
        },
      },
      templateCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_by_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      updated_by_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      approvedStatus: {
        type: Sequelize.ENUM(
          EmailTemplateApprovedStatus.pending,
          EmailTemplateApprovedStatus.approved,
          EmailTemplateApprovedStatus.rejected,
        ),
        field: 'approved_status',
        allowNull: false,
        defaultValue: EmailTemplateApprovedStatus.pending,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['slug', 'workspace_id'],
          name: 'email_templates_slug_workspace_id',
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );
  return EmailTemplate;
};

