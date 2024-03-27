'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campaigns', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      reply_email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
        },
      },
      plain_text: {
        type: Sequelize.TEXT,
      },
      query: {
        type: Sequelize.STRING,
      },
      tracking_open: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      tracking_click: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('campaigns');
  },
};
