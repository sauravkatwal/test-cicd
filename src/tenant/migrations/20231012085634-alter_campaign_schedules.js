'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('campaign_schedules', 'sent_count', {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('campaign_schedules', 'sent_count');
  },
};
