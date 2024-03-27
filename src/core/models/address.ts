import * as Sequelize from 'sequelize';
import { Database } from '../../config';
const sequelize = Database.sequelize;

export class Address extends Sequelize.Model<
  Sequelize.InferAttributes<Address>,
  Sequelize.InferCreationAttributes<Address>
> {
  declare id: Sequelize.CreationOptional<number>;
  declare street: string;
  declare suburb: string;
  declare state: string;
  declare country: string;
  declare company_id: Sequelize.CreationOptional<number>;
  declare postalCode: string;
}

Address.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    suburb: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    company_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    postalCode: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'postal_code'
    }
  },
  {
    tableName: 'addresses',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['company_id'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);
