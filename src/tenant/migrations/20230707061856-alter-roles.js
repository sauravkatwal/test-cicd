'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('roles', 'roles_slug');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('roles', ['slug'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'roles_slug',
      where: {
        deleted_at: null,
      },
    });
  },
};
