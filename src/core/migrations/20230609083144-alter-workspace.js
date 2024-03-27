'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('workspaces', 'db_database', {
      type: Sequelize.STRING(50),
      defaultValue: "postgres"
    });
    await queryInterface.addColumn('workspaces', 'db_username', {
      type: Sequelize.STRING(50),
      defaultValue: 'postgres'
    });
    await queryInterface.addColumn('workspaces', 'db_password', {
      type: Sequelize.STRING(50),
      defaultValue: "postgres"
    });
    await queryInterface.addColumn('workspaces', 'db_host', {
      type: Sequelize.STRING(50),
      defaultValue: "localhost"
    });
    await queryInterface.addColumn('workspaces', 'db_port', {
      type: Sequelize.INTEGER,
      defaultValue: 5432
    });
    await queryInterface.addColumn('workspaces', 'db_dialect', {
      type: Sequelize.STRING(25),
      defaultValue: "postgres",
    });
    await queryInterface.addColumn('workspaces', 'db_dialect_options', {
      type: Sequelize.JSONB,
    });
    await queryInterface.addColumn('workspaces', 'db_logging', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('workspaces', 'db_database');
    await queryInterface.removeColumn('workspaces', 'db_username');
    await queryInterface.removeColumn('workspaces', 'db_password');
    await queryInterface.removeColumn('workspaces', 'db_host');
    await queryInterface.removeColumn('workspaces', 'db_port');
    await queryInterface.removeColumn('workspaces', 'db_dialect');
    await queryInterface.removeColumn('workspaces', 'db_dialect_options');
    await queryInterface.removeColumn('workspaces', 'db_logging');
  },
};