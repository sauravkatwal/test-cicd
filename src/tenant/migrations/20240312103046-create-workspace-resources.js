'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workspace_resources', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      credentials: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM("sqs", "email", "viber", "sms", "whatsapp"),
        allowNull: false
      },
      purpose: {
        type: Sequelize.ENUM("campaign", "import"),
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

    await queryInterface.addIndex(
      "workspace_resources",
      ["workspace_id", "type", "purpose"],
      {
        concurrently: true,
        unique: true,
        type: 'UNIQUE',
        name: 'workspace_resources_workspace_id_type_purpose',
        where: {
          deleted_at: null,
        },
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("workspace_resources", "workspace_resources_workspace_id_type_purpose");
    await queryInterface.dropTable("workspace_resources");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_workspace_resources_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_workspace_resources_purpose";');
  },
};
