'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transaction_logs', 'batch_sanitize_email_registry_group_id', {
      type: DataTypes.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transaction_logs', 'batch_sanitize_email_registry_group_id');
  },
};
