'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('email_registry_campaigns', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email_registry_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'email_registries',
          key: 'id',
        },
      },
      campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'campaigns',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex('email_registry_campaigns', ['email_registry_id', 'campaign_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'email_registry_campaigns_email_registry_id_campaign_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      'email_registry_campaigns',
      'email_registry_campaigns_email_registry_id_campaign_id',
    );
    await queryInterface.dropTable('email_registry_campaigns');
  },
};