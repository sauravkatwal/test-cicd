'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('default_email_templates', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "description"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('default_email_templates', 'description')
  }
};
