import * as Sequelize from 'sequelize';
import { CredentialModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const Credentials = sequelize.define<CredentialModelInterface>(
    'credentials',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      secret: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        field: 'is_active',
        defaultValue: false,
      },
      messagingPlatformId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'messaging_platform_id',
      },
      workspaceId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'workspace_id',
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          name: 'credentials_messaging_platform_id_workspace_id',
          fields: ['messagingPlatformId', 'workspaceId'],
          where: {
            deletedAt: null,
            isActive: true,
          },
        },
      ],
    },
  );
  return Credentials;
};
