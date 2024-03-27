"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("test_email_registries", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull:true,
      },
      phone_number_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull:true,
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("sanitized", "unsanitized"),
        allowNull: false,
        defaultValue: "unsanitized",
      },
      sanitized_status: {
        type: Sequelize.ENUM(
          "deliverable",
          "risky",
          "undeliverable",
          "unknown"
        ),
        defaultValue: null,
      },
      sanitized_reason: {
        type: Sequelize.ENUM(
          "accepted_email",
          "dns_error",
          "invalid_domain",
          "invalid_email",
          "low_deliverability",
          "low_quality",
          "rejected_email",
          "unavailable_smtp",
          "unknown"
        ),
        defaultValue: null,
      },
      sanitized_response: {
        type: Sequelize.JSONB,
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
    await queryInterface.addIndex('test_email_registries', ['email','workspace_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'test_email_registries_email_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('test_email_registries', 'test_email_registries_email_workspace_id');
    await queryInterface.dropTable("test_email_registries");
  },
};
