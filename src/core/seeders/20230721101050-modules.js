/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "modules",
      [
        //dashboard
        {
          id: 23,
          name: "Dashboard Main",
          slug: "dashboard-main",
          is_default: true,
          screen_id: 1,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
       
        //customer
        {
          id: 24,
          name: "Customer Main",
          slug: "customer-main",
          is_default: true,
          screen_id: 2,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
       
        // email group
        {
          id: 25,
          name: "Email Main",
          slug: "email-main",
          is_default: true,
          screen_id: 3,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        // message group
        {
          id: 26,
          name: "Message Main",
          slug: "message-main",
          is_default: true,
          screen_id: 4,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
       
        //template
        {
          id: 27,
          name: "Template Main",
          slug: "template-main",
          is_default: true,
          screen_id: 5,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
       
        //campaign
        {
          id: 28,
          name: "Campaign Main",
          slug: "campaign-main",
          is_default: true,
          screen_id: 6,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
         //Newsletter
         {
          id: 29,
          name: "Newsletter Main",
          slug: "newsletter-main",
          is_default: true,
          screen_id: 7,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
  
        //Campaign Report
        {
          id: 30,
          name: "Campaign Report Main",
          slug: "campaign-report-main",
          is_default: true,
          screen_id: 8,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Members
        {
          id: 31,
          name: "Members Main",
          slug: "members-main",
          is_default: true,
          screen_id: 9,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
       
        // Support
        {
          id: 32,
          name: "Support Main",
          slug: "support-main",
          is_default: true,
          screen_id: 10,
          status:"active",
          description:"",
          created_at: new Date(),
          updated_at: new Date(),
        },
        // settings
        {
          id: 33,
          name: "Settings Main",
          slug: "settings-main",
          is_default: true,
          screen_id: 11,
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
    await queryInterface.bulkDelete("modules", [], {});
  },
};
