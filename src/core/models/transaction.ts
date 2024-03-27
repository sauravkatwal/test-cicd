import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { TransactionModelInterface } from '../../interfaces';
const sequelize = Database.sequelize;

const Transaction = sequelize.define<TransactionModelInterface>(
  'transactions',
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
    transactionCode: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'transaction_code'
    },
    credit: {
      type: Sequelize.INTEGER,
    },
    debit: {
      type: Sequelize.INTEGER,
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
    transactionDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'transaction_date'
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
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

export default Transaction;
