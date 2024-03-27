import * as Sequelize from 'sequelize';
import { Database } from '../../config';
const sequelize = Database.sequelize;
import { UserRoleModelInterface } from '../../interfaces';

const UserRole = sequelize.define<UserRoleModelInterface>(
  'user_roles',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'user_id',
    },
    roleId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
      },
      field: 'role_id',
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

export default UserRole;
