'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, drop the existing "event" column
    await queryInterface.removeColumn('campaign_click_event_response_logs', 'event');

    // Add the new "event" column with the updated enum values
    await queryInterface.addColumn('campaign_click_event_response_logs', 'event', {
      type: Sequelize.ENUM('Open', 'Click', 'Delivery'),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes in the "down" migration
    await queryInterface.removeColumn('campaign_click_event_response_logs', 'event');
    await queryInterface.addColumn('campaign_click_event_response_logs', 'event', {
      type: Sequelize.ENUM('Open', 'Click'),
      allowNull: false
    });
  }
};
