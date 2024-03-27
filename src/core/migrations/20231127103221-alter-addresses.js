'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('addresses', 'postal_code', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('addresses', 'postal_code');
  },
};
