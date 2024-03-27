/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attributes', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_default: {
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
    await queryInterface.addIndex('attributes', ['name'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'attributes_name',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('attributes', 'name');
    await queryInterface.dropTable('attributes');
  },
};