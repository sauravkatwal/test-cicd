/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert(
      "services",
      [
        {
          name: "Bouncer",
          slug: "bouncer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Email",
          slug: "email",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "SMS",
          slug: "sms",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Viber",
          slug: "viber",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "WhatsApp",
          slug: "whatsapp",
          created_at: new Date(),
          updated_at: new Date(),
        }
      ],
      {}
    );
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete("services", [], {});
  }
};
