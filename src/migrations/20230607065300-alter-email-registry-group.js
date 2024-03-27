'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('email_registry_groups', 'is_existing_criteria', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.addColumn('email_registry_groups', 'filter_criteria', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('email_registry_groups', 'is_existing_criteria');
    await queryInterface.removeColumn('email_registry_groups', 'filter_criteria');
  },
};