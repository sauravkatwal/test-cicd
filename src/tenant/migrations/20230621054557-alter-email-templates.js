'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('email_templates', 'approved_status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('email_templates', 'approved_status');
  },
};
