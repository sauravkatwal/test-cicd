'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('batch_sanitize_email_registries', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email_registry_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'email_registries',
          key: 'id',
        },
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      batch_sanitize_email_registry_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'batch_sanitize_email_registry_groups',
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('batch_sanitize_email_registries');
  },
};
