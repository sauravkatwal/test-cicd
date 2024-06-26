/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "privileges",
      [
        //dashboard
        {
          id: 35,
          name: "View Dashboard",
          slug: "view-dashboard",
          module_id: 23,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        //customer
        {
          id: 36,
          name: "View Customer",
          slug: "view-customer",
          module_id: 24,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        // email group
        {
          id: 37,
          name: "View Email Group",
          slug: "view-email-group",
          module_id: 25,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        // message group
        {
          id: 38,
          name: "View Message Group",
          slug: "view-message-group",
          module_id: 26,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        //template
        {
          id: 39,
          name: "View Template",
          slug: "view-template",
          module_id: 27,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Newsletter
        {
          id: 40,
          name: "View Newsletter",
          slug: "view-newsletter",
          module_id: 29,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Campaign Report
        {
          id: 41,
          name: "View Campaign Report",
          slug: "view-campaign-report",
          module_id: 30,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Members
        {
          id: 42,
          name: "View Members",
          slug: "view-members",
          module_id: 31,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Support
        {
          id: 43,
          name: "View Support",
          slug: "view-support",
          module_id: 32,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        //settings
        {
          id: 44,
          name: "View Settings",
          slug: "view-settings",
          module_id: 33,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Campaign
        {
          id: 45,
          name: "View Campaign",
          slug: "view-campaign",
          module_id: 28,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 46,
          name: "Create Email Campaign",
          slug: "create-email-campaign",
          module_id: 11,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 47,
          name: "Create Whatsapp Campaign",
          slug: "create-whatsapp-campaign",
          module_id: 11,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 48,
          name: "Create Viber Campaign",
          slug: "create-viber-campaign",
          module_id: 11,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 49,
          name: "Create SMS Campaign",
          slug: "create-sms-campaign",
          module_id: 11,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 50,
          name: "Campaign Tracking",
          slug: "campaign-tracking",
          module_id: 11,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 51,
          name: "Select Fallback",
          slug: "select-fallback",
          module_id: 11,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 52,
          name: "Approve Template",
          slug: "approve-template",
          module_id: 10,
          is_default: true,
          status: "active",
          description: "",
          created_at: new Date(),
          updated_at: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("privileges", [], {});
  },
};
