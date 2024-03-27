'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('campaign_schedules', 'parent_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'campaign_schedules',
        key: 'id',
      },
    });
    await queryInterface.addColumn('campaign_schedules', 'level', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
    await queryInterface.addColumn('campaign_schedules', 'template_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'email_templates',
        key: 'id',
      },
    });
    await queryInterface.addColumn('campaign_schedules', 'cache_template_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'cache_email_templates',
        key: 'id',
      },
    });
    await queryInterface.addColumn('campaign_schedules', 'type', {
      type: Sequelize.ENUM('unclicked', 'unopened', 'undelivered'),
    });
    await queryInterface.addColumn('campaign_schedules', 'messaging_platform_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'messaging_platforms',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('campaign_schedules', 'parent_id');
    await queryInterface.removeColumn('campaign_schedules', 'level');
    await queryInterface.removeColumn('campaign_schedules', 'templateId');
    await queryInterface.removeColumn('campaign_schedules', 'cacheTemplateId');
    await queryInterface.removeColumn('campaign_schedules', 'type');
    await queryInterface.removeColumn('campaign_schedules', 'messaging_platform_id');
  },
};
