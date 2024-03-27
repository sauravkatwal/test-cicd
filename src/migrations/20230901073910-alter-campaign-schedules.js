'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('campaign_schedules', 'schedule_date_time_utc', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('campaign_schedules', 'schedule_date_time_utc');
  },
};
