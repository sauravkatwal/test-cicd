import * as Sequelize from 'sequelize';
import { ScreenRoleMappingModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const ScreenRoleMapping = sequelize.define<ScreenRoleMappingModelInterface>(
    'screen_role_mappings',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      screenId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'screens',
          key: 'id',
        },
        field: 'screen_id',
      },
      privilegeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'privileges',
          key: 'id',
        },
        field: 'privilege_id',
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        field: 'role_id',
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_default',
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_published',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_active',
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          name: 'screen_role_mappings_moduleId_screenId_privilegeId_roleId',
          fields: ['moduleId', 'screenId', 'privilegeId', 'roleId'],
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );
  return ScreenRoleMapping;
};

