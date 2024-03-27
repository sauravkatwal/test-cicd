'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeIndex('modules', 'modules_slug');
    await queryInterface.addIndex('modules', ['slug','screen_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'modules_slug_screen_id',
      where: {
        deleted_at: null,
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('modules', 'modules_slug_screen_id');
  },
};