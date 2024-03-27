import { RoleModelInterface } from '../../interfaces';
import * as Sequelize from 'sequelize';
import ScreenRoleMapping from './screenRoleMapping';

export default (sequelize: Sequelize.Sequelize) => {
  const Role = sequelize.define<RoleModelInterface>(
    'roles',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_default',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'workspace_id',
      }
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['slug', 'workspaceId'],
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );

  return Role;
};

