/*eslint-disable*/
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
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
      transaction_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      credit: {
        type: Sequelize.INTEGER,
      },
      debit: {
        type: Sequelize.INTEGER,
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'services',
          key: 'id',
        },
      },
      transaction_date: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable('transactions');
  }
};