import * as Sequelize from 'sequelize';
import { Database } from '../../config';
const sequelize = Database.sequelize;

export class Company extends Sequelize.Model<
  Sequelize.InferAttributes<Company>,
  Sequelize.InferCreationAttributes<Company>
> {
  declare id: Sequelize.CreationOptional<number>;
  declare name: string;
  declare workspace_id: number;
  declare registration_number: string;
  declare user_id: Sequelize.CreationOptional<number>;
}

Company.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    registration_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    workspace_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'workspaces',
        key: 'id',
      },
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    tableName: 'companies',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id'],
        where: {
          deleted_at: null,
        },
      },
      {
        unique: true,
        fields: ['workspace_id'],
        where: {
          deleted_at: null,
        },
      },
      {
        unique: true,
        fields: ['registration_number'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);
