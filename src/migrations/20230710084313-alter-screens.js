'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('screens', 'workspace_id');
    await queryInterface.removeIndex('screens', 'screens_slug_workspace_id');
    await queryInterface.addIndex('screens', ['slug'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'screens_slug',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('screens', 'screens_slug');
  },
};