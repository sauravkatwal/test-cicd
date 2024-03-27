'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campaign_schedules', {
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
      schedule_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      schedule_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      time_zone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('draft', 'scheduled', 'completed', 'ongoing', 'failed', 'pending'),
        allowNull: false,
        defaultValue: 'draft',
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workspaces',
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

    await queryInterface.addIndex('campaign_schedules', ['workspace_id', 'campaign_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'campaign_schedules_workspace_id_campaign_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('campaign_schedules', 'campaign_schedules_workspace_id_campaign_id');
    await queryInterface.dropTable('campaign_schedules');
  },
};
