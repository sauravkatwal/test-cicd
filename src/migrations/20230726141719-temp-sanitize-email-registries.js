'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('temp_sanitize_email_registries', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      sanitized_status: {
        type: 'public.enum_email_registries_sanitized_status',
        defaultValue: null,
      },
      sanitized_reason: {
        type: 'public.enum_email_registries_sanitized_reason',
        defaultValue: null,
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sanitized_response: {
        type: Sequelize.JSONB,
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('temp_sanitize_email_registries');
  },
};
