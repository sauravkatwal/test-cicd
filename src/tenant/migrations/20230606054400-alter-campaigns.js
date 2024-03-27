'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('campaigns', 'approved_status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('campaigns', 'approved_status');
  },
};
