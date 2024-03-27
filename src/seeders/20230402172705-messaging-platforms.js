/* eslint-disable */
'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "messaging_platforms",
      [{
        name: 'E-mail',
        slug: 'email',
        level: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'WhatsApp',
        slug: 'whatsapp',
        level: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Viber',
        slug: 'viber',
        level: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
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
