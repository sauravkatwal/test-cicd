import * as Sequelize from 'sequelize';
import { Database } from '../../config';
const sequelize = Database.sequelize;

export class User extends Sequelize.Model<Sequelize.InferAttributes<User>, Sequelize.InferCreationAttributes<User>> {
  declare id: Sequelize.CreationOptional<number>;
  declare sub: string;
  declare name: string;
  declare username: string;
  declare email: string;
  declare email_verified: boolean;
  declare phone_number: string;
  declare phone_number_verified: boolean;
  declare confirmation_status: boolean;
  declare account_status: boolean;
}

User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    sub: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    email_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    phone_number_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    confirmation_status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    account_status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);
