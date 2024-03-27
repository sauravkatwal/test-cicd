'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workspace_api_keys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      api_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      workspace_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'workspaces',
          key: 'id',
        },
      },
      enable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex("workspace_api_keys", ["workspace_id","api_key"], {
      concurrently: true,
      type: 'UNIQUE',
      name: 'workspace_api_keys_workspace_id_api_key',
      where: {
        deleted_at: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('workspace_api_keys');
  }
};