'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sparrow_sms_credentials', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      base_url: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'http://api.sparrowsms.com/v2',
      },
      access_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      from: {
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

    await queryInterface.addIndex('sparrow_sms_credentials', ['workspace_id'], {
      concurrently: true,
      unique: false,
      name: 'sparrow_sms_credentials_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('sparrow_sms_credentials', 'sparrow_sms_credentials_workspace_id');
    await queryInterface.dropTable('sparrow_sms_credentials');
  },
};
