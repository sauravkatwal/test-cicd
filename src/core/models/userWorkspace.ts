import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { UserWorkspaceStatusEnum } from '../../enums';
const sequelize = Database.sequelize;

export class UserWorkspace extends Sequelize.Model<
  Sequelize.InferAttributes<UserWorkspace>,
  Sequelize.InferCreationAttributes<UserWorkspace>
> {
  declare id: Sequelize.CreationOptional<number>;
  declare user_id: Sequelize.CreationOptional<number>;
  declare workspace_id: Sequelize.CreationOptional<number>;
  declare status: UserWorkspaceStatusEnum;
}

UserWorkspace.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    workspace_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'workspaces',
        key: 'id',
      },
    },
    status: {
      type: Sequelize.ENUM(
        UserWorkspaceStatusEnum.pending,
        UserWorkspaceStatusEnum.accepted,
        UserWorkspaceStatusEnum.declined,
        UserWorkspaceStatusEnum.expired,
      ),
      allowNull: false,
      defaultValue: UserWorkspaceStatusEnum.pending,
    },
  },
  {
    tableName: 'user_workspaces',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'workspace_id'],
        where: {
          deleted_at: null,
        },
      },
      {
        unique: true,
        fields: ['user_id'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);
