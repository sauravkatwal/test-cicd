import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { PrivilegeModelInterface } from '../../interfaces';
import Module from './module';
const sequelize = Database.sequelize;

const Privilege = sequelize.define<PrivilegeModelInterface>(
  'privileges',
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
    moduleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'modules',
        key: 'id',
      },
      field: 'module_id',
    },
    isDefault: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_default',
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
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

// Module and privilege relation
Privilege.belongsTo(Module, {
  foreignKey: 'moduleId',
  as: 'module',
});

Module.hasMany(Privilege, {
  foreignKey: 'moduleId',
  as: 'privileges',
});

export default Privilege;
