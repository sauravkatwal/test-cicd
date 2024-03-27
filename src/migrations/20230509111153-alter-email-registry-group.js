'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_registry_groups', 'type', {
        type: Sequelize.ENUM("email","message"),
        allowNull: false,
        defaultValue: "email",

    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('email_registry_groups', 'type');
  },
};
