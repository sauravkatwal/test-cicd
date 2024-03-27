'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_workspace_roles', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_workspace_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user_workspaces',
          key: 'id',
        },
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id',
        },
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
    await queryInterface.addIndex("user_workspace_roles", [
      "user_workspace_id",
      "role_id",
    ],{
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'user_workspace_roles_user_workspace_id_role_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("user_workspace_roles","user_workspace_roles_user_workspace_id_role_id");
    await queryInterface.dropTable("user_workspace_roles");
  },
};
