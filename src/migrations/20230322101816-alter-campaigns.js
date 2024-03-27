
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('campaigns', 'is_archive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('campaigns', 'is_archive');
  }
};