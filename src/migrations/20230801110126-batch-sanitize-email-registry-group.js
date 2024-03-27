'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('batch_sanitize_email_registry_groups', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email_registry_group_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'email_registry_groups',
          key: 'id',
        },
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      batch_request_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      log: {
        type: Sequelize.JSONB,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('batch_sanitize_email_registry_groups');
  },
};
