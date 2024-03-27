// eslint-disable-next-line strict
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campaign_click_events', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email_registry_campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'email_registry_campaigns',
          key: 'id',
        },
      },
      event: {
        type: Sequelize.ENUM('Open', 'Click', 'Delivery', 'Bounce', 'Send'),
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      messaging_platform_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      link: {
        type: Sequelize.TEXT,
      },
      service: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.addIndex('campaign_click_events', ['workspace_id'], {
      concurrently: true,
      unique: false,
      name: 'campaign_click_event_workspace_id',
      where: {
        deleted_at: null,
      },
    });

    await queryInterface.addIndex('campaign_click_events', ['email_registry_campaign_id'], {
      concurrently: true,
      unique: false,
      name: 'campaign_click_event_email_registry_campaign_id',
      where: {
        deleted_at: null
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('campaign_click_events', 'campaign_click_event_workspace_id');
    await queryInterface.removeIndex('campaign_click_events', 'campaign_click_event_email_registry_campaign_id');
    await queryInterface.dropTable('campaign_click_events');
  }
};
