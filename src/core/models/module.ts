import * as Sequelize from 'sequelize';

import { ModuleModelInterface } from '../../interfaces';
import { Database } from '../../config';
import Screen from './screen';

const sequelize = Database.sequelize;

const Module = sequelize.define<ModuleModelInterface>(
  'modules',
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
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isDefault: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_default',
    },
    screenId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'screens',
        key: 'id',
      },
      field: 'screen_id',
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

// Screen and Module relation
Module.belongsTo(Screen, {
  foreignKey: 'screenId',
  as: 'screen',
});

Screen.hasMany(Module, {
  foreignKey: 'screenId',
  as: 'modules',
});

export default Module;
