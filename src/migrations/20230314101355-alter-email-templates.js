'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('email_templates', 'is_campaign');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_templates', 'is_campaign', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
};
