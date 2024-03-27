'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('screens', 'workspace_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.removeIndex('screens', 'screens_slug');
    await queryInterface.addIndex('screens', ['slug','workspace_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'screens_slug_workspace_id',
      where: {
        deleted_at: null,
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('screens', 'workspace_id');
    await queryInterface.removeIndex('screens', 'screens_slug_workspace_id');
  },
};