/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "screens",
      [
        {
          id: 1,
          name: "Dashboard",
          slug: "dashboard",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: "Customer List",
          slug: "customer-list",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: "Email Groups",
          slug: "email-groups",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          name: "Message Groups",
          slug: "message-groups",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 5,
          name: "Templates",
          slug: "templates",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          name: "Campaign",
          slug: "campaign",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 7,
          name: "Newsletter",
          slug: "newsletter",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 8,
          name: "Campaign Report",
          slug: "campaign-report",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 9,
          name: "Members",
          slug: "members",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 10,
          name: "Support",
          slug: "support",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 11,
          name: "Settings",
          slug: "settings",
          is_default: true,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("screens", [], {});
  },
};
