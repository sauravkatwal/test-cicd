'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('modules', 'workspace_id');
    await queryInterface.removeIndex('modules', 'modules_slug_workspace_id');
    await queryInterface.addIndex('modules', ['slug'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'modules_slug',
      where: {
        deleted_at: null,
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('modules', 'modules_slug');
  },
};