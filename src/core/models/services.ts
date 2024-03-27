import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { ServiceModelInterface } from '../../interfaces';
const sequelize = Database.sequelize;

const Service = sequelize.define<ServiceModelInterface>(
  'services',
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
      unique: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: 'services_slug',
        fields: ['slug'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);

export default Service;
