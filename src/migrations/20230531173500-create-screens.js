'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('screens', {
      id: {
        type: DataTypes.INTEGER,
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
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      },
      description: {
        type: Sequelize.STRING,
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
    await queryInterface.addIndex('screens', ['slug'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'screens_slug',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('screens', 'screens_slug');
    await queryInterface.dropTable('screens');
  },
};
