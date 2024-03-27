'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('credentials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      secret: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      messaging_platform_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'messaging_platforms',
          key: 'id',
        },
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.addIndex('credentials', ['messaging_platform_id', 'workspace_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'credentials_messaging_platform_id_workspace_id',
      where: {
        deleted_at: null,
        is_active: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('credentials', 'credentials_messaging_platform_id_workspace_id');
    await queryInterface.dropTable('credentials');
  }
};