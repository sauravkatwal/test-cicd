import * as Sequelize from 'sequelize';
import { UserWorkspaceRoleModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const UserWorkspaceRole = sequelize.define<UserWorkspaceRoleModelInterface>(
    'user_workspace_roles',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_workspace_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user_workspaces',
          key: 'id',
        },
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['user_workspace_id', 'role_id'],
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );

  return UserWorkspaceRole;
};
