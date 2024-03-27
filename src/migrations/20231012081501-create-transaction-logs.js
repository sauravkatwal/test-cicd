/*eslint-disable*/
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'services',
          key: 'id',
        },
      },
      campaign_schedule_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'campaign_schedules',
          key: 'id',
        },
      },
      transaction_by_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      release_balance: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      sanitized_email_registry_ids: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
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
        field: 'deleted_at',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaction_logs');
  }
};