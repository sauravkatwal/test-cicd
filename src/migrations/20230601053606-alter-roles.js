'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('roles', 'is_active', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('roles', 'is_default', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('roles', 'position', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('roles', 'is_active');
    await queryInterface.removeColumn('roles', 'is_default');
    await queryInterface.removeColumn('roles', 'position');
  },
};
