'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aws_ses_credentials', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      region: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      access_key_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      access_key_secret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      configuration_name: {
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

    await queryInterface.addIndex('aws_ses_credentials', ['workspace_id'], {
      concurrently: true,
      unique: false,
      name: 'aws_ses_credentials_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('aws_ses_credentials', 'aws_ses_credentials_workspace_id');
    await queryInterface.dropTable('aws_ses_credentials');
  },
};
