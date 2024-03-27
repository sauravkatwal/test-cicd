
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('campaigns', 'tracking_deliver', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('campaigns', 'tracking_deliver');
  }
};