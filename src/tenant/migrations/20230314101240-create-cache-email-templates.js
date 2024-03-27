'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cache_email_templates', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      content_html: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_by_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      updated_by_id: {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cache_email_templates');
  },
};
