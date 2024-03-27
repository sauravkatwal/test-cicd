import * as Sequelize from 'sequelize';
import { BatchSanitizeEmailRegistryGroupModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const BatchSanitizeEmailRegistryGroup = sequelize.define<BatchSanitizeEmailRegistryGroupModelInterface>(
    'batch_sanitize_email_registry_groups',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      emailRegistryGroupId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'email_registry_groups',
          key: 'id',
        },
        field: 'email_registry_group_id',
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'workspace_id',
      },
      batchRequestId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'batch_request_id',
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      log: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  return BatchSanitizeEmailRegistryGroup;
};
