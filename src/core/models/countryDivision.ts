import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { CountryDivisionModelInterface } from '../../interfaces';
const sequelize = Database.sequelize;

const CountryDivision = sequelize.define<CountryDivisionModelInterface>(
  'country_divisions',
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
    country: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    state_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'country_divisions',
        key: 'id',
      },
    },
    district: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_default: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: 'country_divisions_slug_type',
        fields: ['slug', 'type'],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);

export default CountryDivision;
