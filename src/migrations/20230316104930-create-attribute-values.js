/* eslint-disable no-undef */
'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attribute_values', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
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
      attribute_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'attributes',
          key: 'id',
        },
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
    await queryInterface.addIndex('attribute_values', ['value', 'attribute_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'attribute_values_value_attribute_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('attribute_values', 'value_attribute_id');
    await queryInterface.dropTable('attribute_values');
  },
};