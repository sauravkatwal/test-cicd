/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "privileges",
      [
        {
          id: 53,
          name: "Sanitize Email",
          slug: "sanitize-email",
          module_id: 3,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 54,
          name: "Create Email Template",
          slug: "create-email-template",
          module_id: 9,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 55,
          name: "Create Viber Template",
          slug: "create-viber-template",
          module_id: 9,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 56,
          name: "Create WhatsApp Template",
          slug: "create-whatsapp-template",
          module_id: 9,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 57,
          name: "Create SMS Template",
          slug: "create-sms-template",
          module_id: 9,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 58,
          name: "Create Email Fallback",
          slug: "create-email-fallback",
          module_id: 11,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 59,
          name: "Create Viber Fallback",
          slug: "create-viber-fallback",
          module_id: 11,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 60,
          name: "Create WhatsApp Fallback",
          slug: "create-whatsapp-fallback",
          module_id: 11,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 61,
          name: "Create SMS Fallback",
          slug: "create-sms-fallback",
          module_id: 11,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("privileges", [], {});
  },
};
