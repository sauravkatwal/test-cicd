'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_rates', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'services',
          key: 'id',
        },
      },
      credit_unit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      workspace_id: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.addIndex('service_rates', ['service_id', 'workspace_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'service_rates_service_id_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('service_rates', 'service_rates_service_id_workspace_id');
    await queryInterface.dropTable('service_rates');
  },
};