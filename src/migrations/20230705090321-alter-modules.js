'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('modules', 'workspace_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.removeIndex('modules', 'modules_slug');
    await queryInterface.addIndex('modules', ['slug','workspace_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'modules_slug_workspace_id',
      where: {
        deleted_at: null,
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('modules', 'workspace_id');
    await queryInterface.removeIndex('modules', 'modules_slug_workspace_id');
  },
};