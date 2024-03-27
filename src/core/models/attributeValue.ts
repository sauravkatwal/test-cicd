import * as Sequelize from 'sequelize';
import { Database } from '../../config';
const sequelize = Database.sequelize;
import {AttributeValueModelInterface} from '../../interfaces';



const AttributeValues = sequelize.define<AttributeValueModelInterface>(
  'attribute_values',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field:'is_active',
    },
    isDefault: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field:'is_default',
    },
    attributeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field:'attribute_id',
      references: {
        model: 'attributes',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['slug', 'attribute_id'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);

export default AttributeValues;