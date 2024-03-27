'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('privileges', 'workspace_id');
    await queryInterface.removeIndex('privileges', 'privileges_slug_workspace_id');
    await queryInterface.addIndex('privileges', ['slug'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'privileges_slug',
      where: {
        deleted_at: null,
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('privileges', 'privileges_slug');
  },
};