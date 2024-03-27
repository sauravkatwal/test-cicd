'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_registry_campaigns', 'is_deliverable', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('email_registry_campaigns', 'aws_ses_message_id', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('email_registry_campaigns', 'is_deliverable');
    await queryInterface.removeColumn('email_registry_campaigns', 'aws_ses_message_id');
  },
};