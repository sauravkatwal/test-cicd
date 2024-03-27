import * as Sequelize from 'sequelize';
import { EventEnum } from '../../enums';
import { CampaignClickEventModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const CampaignClickEvent = sequelize.define<CampaignClickEventModelInterface>(
    'campaign_click_events',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      emailRegistryCampaignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'email_registry_campaign_id',
        references: {
          model: 'email_registry_campaigns',
          key: 'id',
        },
      },
      event: {
        type: Sequelize.ENUM(
          EventEnum.open,
          EventEnum.click,
          EventEnum.delivery,
          EventEnum.bounce,
          EventEnum.send,
        ),
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'workspace_id',
        references: {
          model: 'workspaces',
          key: 'id',
        },
      },
      messagingPlatformId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'messaging_platform_id',
        references: {
          model: 'messaging_platforms',
          key: 'id',
        },
      },
      link: {
        type: Sequelize.TEXT,
      },
      service: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: false,
          name: 'campaign_click_event_workspace_id',
          fields: ['workspaceId'],
          where: {
            deleted_at: null,
          },
        },
        {
          unique: false,
          name: 'campaign_click_event_email_registry_campaign_id',
          fields: ['emailRegistryCampaignId'],
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );
  return CampaignClickEvent;
};
