'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('user_workspaces', ['user_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'user_workspaces_user_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('user_workspaces_user_id');
  },
};
