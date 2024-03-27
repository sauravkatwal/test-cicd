import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { CoreRoleModelInterface } from '../../interfaces';

const sequelize = Database.sequelize;

const CoreRole = sequelize.define<CoreRoleModelInterface>(
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
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['slug'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);

export default CoreRole;
