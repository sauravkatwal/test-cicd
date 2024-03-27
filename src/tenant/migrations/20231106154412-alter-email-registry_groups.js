'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_registry_groups', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('email_registry_groups', 'description');
  },
};
