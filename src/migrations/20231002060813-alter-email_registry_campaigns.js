'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_registry_campaigns', 'sparrow_viber_batch_id', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('email_registry_campaigns', 'sparrow_sms_message_id', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('email_registry_campaigns', 'sparrow_viber_batch_id');
    await queryInterface.removeColumn('email_registry_campaigns', 'sparrow_sms_message_id');
  },
};
