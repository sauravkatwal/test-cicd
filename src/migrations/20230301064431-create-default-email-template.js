// eslint-disable-next-line strict

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('default_email_templates', {
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
      content: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      content_html: {
        type: Sequelize.JSONB,
        allowNull: true,
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
    await queryInterface.addIndex('default_email_templates', ['slug'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'default_email_templates_slug',
      where: {
        deleted_at: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('default_email_templates', 'default_email_templates_slug');
    await queryInterface.dropTable('default_email_templates');
  },
};
