'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'attribute_values',
      [
        {
          value: 'Male',
          slug:'male',
          description: '',
          attribute_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          value: 'Female',
          slug:'female',
          description: '',
          attribute_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          value: 'Other',
          slug:'other',
          description: '',
          attribute_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Nationality
        {
          value: 'Nepalese',
          slug:'nepalese',
          description: '',
          attribute_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },{
          value: 'Indian',
          slug:'indian',
          description: '',
          attribute_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },{
          value: 'Foreigners',
          slug:'foreigners',
          description: '',
          attribute_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('attribute_values', null, {});
  },
};
