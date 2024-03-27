import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { ServiceRateModelInterface } from '../../interfaces';

const sequelize = Database.sequelize;

const ServiceRate = sequelize.define<ServiceRateModelInterface>(
  'service_rates',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    serviceId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'services',
        key: 'id',
      },
      field: 'service_id',
    },
    creditUnit: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'credit_unit',
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    workspaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'workspace_id'
    }
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: 'service_rates_service_id',
        fields: ['service_id'],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);

export { ServiceRate };
