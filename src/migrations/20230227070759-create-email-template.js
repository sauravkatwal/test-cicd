'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('email_templates', {
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
      is_campaign: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id',
        },
      },
      created_by_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      updated_by_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
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
    await queryInterface.addIndex('email_templates', ['slug','workspace_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'email_templates_slug_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('email_templates', 'email_templates_slug_workspace_id');
    await queryInterface.dropTable('email_templates');
  },
};
