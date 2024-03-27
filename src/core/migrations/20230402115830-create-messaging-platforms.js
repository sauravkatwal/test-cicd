/* eslint-disable */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('messaging_platforms', {
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
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      level: {
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
        field: 'deleted_at',
      },
    });
    await queryInterface.addIndex("messaging_platforms", ["slug"], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'messaging_platforms_slug',
      where: {
        deleted_at: null,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('messaging_platforms');

  }
};
