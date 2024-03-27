'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('screen_role_mappings', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      screen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      privilege_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
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
    await queryInterface.addIndex('screen_role_mappings', ['module_id', 'screen_id', 'privilege_id', 'role_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'screen_role_mappings_module_id_screen_id_privilege_id_role_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      'screen_role_mappings',
      'screen_role_mappings_module_id_screen_id_privilege_id_role_id',
    );
    await queryInterface.dropTable('screen_role_mappings');
  },
};
