import * as Sequelize from 'sequelize';
import { CampaignApprovedStatus } from '../../enums';
import { CampaignModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const Campaign = sequelize.define<CampaignModelInterface>(
    'campaign',
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
      description: {
        type: Sequelize.TEXT,
      },
      replyEmail: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'reply_email',
        validate: {
          isEmail: true,
        },
      },
      plainText: {
        type: Sequelize.TEXT,
        field: 'plain_text',
      },
      query: {
        type: Sequelize.INTEGER,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      trackingOpen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'tracking_open',
      },
      trackingClick: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'tracking_click',
      },
      trackingDeliver: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'tracking_deliver',
      },
      workspaceId: {
        type: Sequelize.NUMBER,
        allowNull: false,
        field: 'workspace_id',
        references: {
          model: 'workspaces',
          key: 'id',
        },
      },
      isArchive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_archive',
      },
      approvedStatus: {
        type: Sequelize.ENUM(
          CampaignApprovedStatus.pending,
          CampaignApprovedStatus.approved,
          CampaignApprovedStatus.rejected,
        ),
        field: 'approved_status',
        allowNull: false,
        defaultValue: CampaignApprovedStatus.pending,
      },
      fromEmail: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'from_email',
        validate: {
          isEmail: true,
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );
  return Campaign;
};

