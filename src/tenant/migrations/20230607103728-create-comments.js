'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'campaigns',
          key: 'id',
        },
      },
      email_template_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'email_templates',
          key: 'id',
        },
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false,
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

    await queryInterface.addIndex('comments', ['campaign_id'], {
      concurrently: true,
      unique: false,
      name: 'comment_campaign_id',
      where: {
        deleted_at: null,
      },
    });

    await queryInterface.addIndex('comments', ['email_template_id'], {
      concurrently: true,
      unique: false,
      name: 'comment_email_template_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('comments', 'comment_campaign_id');
    await queryInterface.removeIndex('comments', 'comment_email_template_id');
    await queryInterface.dropTable('comments');
  },
};
