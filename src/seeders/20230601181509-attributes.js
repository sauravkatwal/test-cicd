'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'attributes',
      [
        {
          name: 'gender',
          description: '',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'nationality',
          description: '',
          created_at: new Date(),
          updated_at: new Date(),
        },

      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('attributes', null, {});
  },
};
