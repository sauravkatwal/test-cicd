'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('screen_plan_mappings', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'modules',
          key: 'id',
        },
      },
      screen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'screens',
          key: 'id',
        },
      },
      privilege_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'privileges',
          key: 'id',
        },
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    });
    await queryInterface.addIndex('screen_plan_mappings', ['module_id', 'screen_id', 'privilege_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'screen_plan_mappings_module_id_screen_id_privilege_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      'screen_plan_mappings',
      'screen_plan_mappings_module_id_screen_id_privilege_id',
    );
    await queryInterface.dropTable('screen_plan_mappings');
  },
};
