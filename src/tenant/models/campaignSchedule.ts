import * as Sequelize from 'sequelize';
import { CampaignScheduleModelInterface } from '../../interfaces';
import { FallbackTypeEnum, ScheduleStatusEnum } from '../../enums';

export default (sequelize: Sequelize.Sequelize) => {
  const CampaignSchedule = sequelize.define<CampaignScheduleModelInterface>(
    'campaign_schedule',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      campaignId: {
        type: Sequelize.INTEGER,
        field: 'campaign_id',
        allowNull: true,
        references: {
          model: 'campaigns',
          key: 'id',
        },
      },
      scheduleDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        field: 'schedule_date',
      },
      scheduleTime: {
        type: Sequelize.TIME,
        allowNull: false,
        field: 'schedule_time',
      },
      timeZone: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'time_zone',
      },
      status: {
        type: Sequelize.ENUM(
          ScheduleStatusEnum.draft,
          ScheduleStatusEnum.scheduled,
          ScheduleStatusEnum.completed,
          ScheduleStatusEnum.failed,
          ScheduleStatusEnum.ongoing,
          ScheduleStatusEnum.pending,
        ),
        allowNull: false,
        defaultValue: ScheduleStatusEnum.draft,
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
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'parent_id',
        references: {
          model: 'campaign_schedules',
          key: 'id',
        },
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'level',
      },
      templateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'template_id',
        references: {
          model: 'email_templates',
          key: 'id',

        }
      },
      cacheTemplateId: {
        type: Sequelize.INTEGER,
        field: 'cache_template_id',
        references: {
          model: 'cache_email_templates',
          key: 'id',
        }
      },
      type: {
        type: Sequelize.ENUM(FallbackTypeEnum.unclicked, FallbackTypeEnum.unopened, FallbackTypeEnum.undelivered),
        field: 'type',
      },
      messagingPlatformId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'messaging_platform_id',
        references: {
          model: 'messaging_platforms',
          key: 'id',
        }
      },
      scheduleDateTimeUtc: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'schedule_date_time_utc'
      },
      sentCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'sent_count'
      }
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['campaignId', 'workspaceId'],
          name: 'campaign_schedules_workspace_id_campaign_id',
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );
  return CampaignSchedule;
};
