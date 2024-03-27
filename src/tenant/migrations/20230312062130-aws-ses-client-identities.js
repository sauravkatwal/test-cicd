'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aws_ses_client_identities', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('Domain', 'EmailAddress'),
        allowNull: false,
        defaultValue: 'EmailAddress',
      },
      identity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('success', 'failed','pending','temporary_failure','not_started'),
        allowNull: false,
        defaultValue: 'pending',
      },
      workspace_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.addIndex('aws_ses_client_identities', ['identity', 'workspace_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'aws_ses_client_identities_identity_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('aws_ses_client_identities','aws_ses_client_identities_identity_workspace_id');
    await queryInterface.dropTable('aws_ses_client_identities');
  },
};
