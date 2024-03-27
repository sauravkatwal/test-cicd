import * as Sequelize from 'sequelize';
import { Database } from '../../config';
const sequelize = Database.sequelize;

export class Attribute extends Sequelize.Model<
  Sequelize.InferAttributes<Attribute>,
  Sequelize.InferCreationAttributes<Attribute>
> {
  declare id: Sequelize.CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare is_active: boolean;
  declare is_default: boolean;
}

Attribute.init(
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
    description: {
      type: Sequelize.TEXT,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_default: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'attributes',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);
