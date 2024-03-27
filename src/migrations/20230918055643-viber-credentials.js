'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('viber_credentials', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sender_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      api_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      partner_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex('viber_credentials', ['workspace_id'], {
      concurrently: true,
      unique: false,
      name: 'viber_credentials_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('viber_credentials', 'viber_credentials_workspace_id');
    await queryInterface.dropTable('viber_credentials');
  },
};
