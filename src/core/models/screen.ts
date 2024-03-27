import * as Sequelize from 'sequelize';
import { ScreenModelInterface } from '../../interfaces';
import { Database } from '../../config';
import { ScreenStatusEnum } from '../../enums';

const sequelize = Database.sequelize;

const Screen = sequelize.define<ScreenModelInterface>(
  'screens',
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
    status: {
      type: Sequelize.ENUM(ScreenStatusEnum.active, ScreenStatusEnum.inactive),
      allowNull: false,
      defaultValue: ScreenStatusEnum.active,
    },
    description: {
      type: Sequelize.STRING,
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

export default Screen;
