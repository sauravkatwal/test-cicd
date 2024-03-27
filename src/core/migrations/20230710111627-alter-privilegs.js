'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeIndex('privileges', 'privileges_slug');
    await queryInterface.addIndex('privileges', ['slug','module_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'privileges_slug_module_id',
      where: {
        deleted_at: null,
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('privileges', 'privileges_slug_module_id');
  },
};