'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_templates', 'messaging_platform', {
      type: Sequelize.ENUM('email', 'whatsapp', 'viber', 'sms'),
      allowNull: false,
      defaultValue: "email",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('email_templates', 'messaging_platform');
  },
};