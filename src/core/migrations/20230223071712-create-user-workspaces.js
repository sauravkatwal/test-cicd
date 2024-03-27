'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_workspaces', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'declined', 'expired'),
        allowNull: false,
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex("user_workspaces", [
      "user_id",
      "workspace_id",
    ],{
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'user_workspaces_user_id_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("user_workspaces",'user_workspaces_user_id_workspace_id' );
    await queryInterface.dropTable("user_workspaces");
  },
};
