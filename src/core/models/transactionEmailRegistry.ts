import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { TransactionEmailRegistryModelInterface } from '../../interfaces';
const sequelize = Database.sequelize;

const TransactionEmailRegistry = sequelize.define<TransactionEmailRegistryModelInterface>(
  'transaction_email_registries',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    emailRegistryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'email_registry_id',
    },
    transactionId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'transactions',
        key: 'id',
      },
      field: 'transaction_id'
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

export default TransactionEmailRegistry;
