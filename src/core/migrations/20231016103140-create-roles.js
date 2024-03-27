/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_default',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addIndex('roles', ['slug'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'roles_slug',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('roles', 'slug');
    await queryInterface.dropTable('roles');
  },
};