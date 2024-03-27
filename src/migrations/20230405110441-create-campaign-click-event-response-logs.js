'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campaign_click_event_response_logs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      log: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      event: {
        type: Sequelize.ENUM('Open', 'Click'),
        allowNull: false
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "workspaces",
          key: "id",
        },
      },
      campaign_click_event_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "campaign_click_events",
          key: "id"
        }
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

    await queryInterface.addIndex('campaign_click_event_response_logs', ['workspace_id'], {
      concurrently: true,
      unique: false,
      name: 'campaign_click_event_response_log_workspace_id',
      where: {
        deleted_at: null,
      },
    });

    await queryInterface.addIndex('campaign_click_event_response_logs', ['campaign_click_event_id'], {
      concurrently: true,
      unique: false,
      name: 'campaign_click_event_response_log_campaign_click_event_id',
      where: {
        deleted_at: null
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("campaign_click_event_response_logs", "campaign_click_event_response_log_workspace_id");
    await queryInterface.removeIndex("campaign_click_event_response_logs", "campaign_click_event_response_log_campaign_click_event_id");
    await queryInterface.dropTable('campaign_click_event_response_logs');
  }
};
