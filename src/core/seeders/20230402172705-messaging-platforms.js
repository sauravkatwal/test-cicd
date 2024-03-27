/* eslint-disable */
'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "messaging_platforms",
      [{
        id: 1,
        name: 'E-mail',
        slug: 'email',
        level: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'WhatsApp',
        slug: 'whatsapp',
        level: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'Viber',
        slug: 'viber',
        level: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: "SMS",
        slug: "sms",
        level: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("messaging_platforms", [], {});
  }
};
