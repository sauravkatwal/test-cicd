import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { TransactionLogModelInterface } from '../../interfaces';
const sequelize = Database.sequelize;

const TransactionLog = sequelize.define<TransactionLogModelInterface>(
  'transaction_logs',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    workspaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'workspace_id'
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    serviceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id',
      },
      field: 'service_id'
    },
    campaignScheduleId: {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'campaign_schedules',
        key: 'id',
      },
      field: 'campaign_schedule_id'
    },
    transactionById: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'transaction_by_id'
    },
    releaseBalance: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'release_balance'
    },
    sanitizedEmailRegistryIds: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      field: 'sanitized_email_registry_ids'
    },
    batchSanitizeEmailRegistryGroupId: {
      type: Sequelize.INTEGER,
      field: 'batch_sanitize_email_registry_group_id'
    }
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

export default TransactionLog;
