'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('privileges', {
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
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'modules',
          key: 'id',
        },
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
    await queryInterface.addIndex('privileges', ['slug'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'privileges_slug',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('privileges', 'slug');
    await queryInterface.dropTable('privileges');
  },
};
