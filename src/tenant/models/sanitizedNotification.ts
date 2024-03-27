import { SanitizedNotificationModelInterface } from '../../interfaces';
import * as Sequelize from 'sequelize';

export default (sequelize: Sequelize.Sequelize) => {
  const SanitizedNotification = sequelize.define<SanitizedNotificationModelInterface>(
    'sanitized_notifications',
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
        field: 'workspace_id',
        references: {
          model: 'workspaces',
          key: 'id',
        },
      },
      logs: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  return SanitizedNotification;
};
