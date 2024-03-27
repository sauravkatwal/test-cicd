
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('roles', 'workspace_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addIndex('roles', ['slug', 'workspace_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'roles_slug_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('roles', 'workspace_id');
    await queryInterface.removeIndex('roles', 'roles_slug_workspace_id');
  }
};
