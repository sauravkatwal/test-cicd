'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'workspace_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'workspaces',
        key: 'id',
      },
      onUpdate: 'CASCADE',
    });

    await queryInterface.addIndex('companies', ['workspace_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'companies_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('companies', 'companies_workspace_id');
    await queryInterface.removeColumn('companies', 'workspace_id');
  },
};
