'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ws_connections', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      connection_ids: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'workspaces',
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ws_connections');
  },
};
