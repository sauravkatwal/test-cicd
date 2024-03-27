'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('privileges', 'workspace_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.removeIndex('privileges', 'privileges_slug');
    await queryInterface.addIndex('privileges', ['slug','workspace_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'privileges_slug_workspace_id',
      where: {
        deleted_at: null,
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('privileges', 'workspace_id');
    await queryInterface.removeIndex('privileges', 'privileges_slug_workspace_id');
  },
};