/*eslint-disable*/
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_email_registries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'transactions',
          key: 'id',
        },
      },
      email_registry_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('transaction_email_registries');
  }
};