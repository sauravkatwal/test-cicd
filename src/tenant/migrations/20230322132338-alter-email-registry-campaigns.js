'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_registry_campaigns', 'email_registry_group_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'email_registry_groups',
        key: 'id',
      },
    });
    await queryInterface.removeIndex(
      'email_registry_campaigns',
      'email_registry_campaigns_email_registry_id_campaign_id',
    );
    await queryInterface.addIndex(
      'email_registry_campaigns',
      ['email_registry_id', 'campaign_id', 'email_registry_group_id'],
      {
        concurrently: true,
        unique: true,
        type: 'UNIQUE',
        name: 'email_registry_campaigns_email_registry_id_campaign_id_email_registry_group_id',
        where: {
          deleted_at: null,
        },
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      'email_registry_campaigns',
      'email_registry_campaigns_email_registry_id_campaign_id_email_registry_group_id',
    );
    await queryInterface.removeColumn('email_registry_campaigns', 'email_registry_group_id');
  },
};
