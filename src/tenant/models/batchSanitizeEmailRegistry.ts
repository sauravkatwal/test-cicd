import * as Sequelize from 'sequelize';
import { BatchSanitizeEmailRegistryModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const BatchSanitizeEmailRegistry = sequelize.define<BatchSanitizeEmailRegistryModelInterface>(
    'batch_sanitize_email_registries',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      batchSanitizeEmailRegistryGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'batch_sanitize_email_registry_groups',
          key: 'id',
        },
        field: 'batch_sanitize_email_registry_group_id',
      },
      emailRegistryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'email_registries',
          key: 'id',
        },
        field: 'email_registry_id',
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'workspace_id',
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  return BatchSanitizeEmailRegistry;
};
