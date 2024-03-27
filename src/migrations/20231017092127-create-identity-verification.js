'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('identity_verifications', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      identity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
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
      meta: {
        type: Sequelize.JSONB,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('identity_verifications'); 
  },
};