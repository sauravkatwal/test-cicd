/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "screen_role_mappings",
      [
        // dashboard 
        // View Dashboard Notification
        {
          id:1,
          screen_id: 1,
          module_id: 1,  
          privilege_id: 1,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }, 
        //Create Template From Dashboard
        {
          id: 2,
          screen_id: 1,
          module_id: 2,  
          privilege_id: 2,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Customer List
        // export email
        {
          id: 3,
          screen_id: 2,
          module_id: 3,  
          privilege_id: 3,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // import email
        {
          id: 4,
          screen_id: 2,
          module_id: 3,  
          privilege_id: 4,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // add customer
        {
          id: 5,
          screen_id: 2,
          module_id: 3,  
          privilege_id: 5,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // update customer
        {
          id: 6,
          screen_id: 2,
          module_id: 4,  
          privilege_id: 6,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
          // delete customer
          {
            id: 7,
            screen_id: 2,
            module_id: 4,  
            privilege_id: 7,
            role_id: 1,
            is_default: true,
            is_published: true,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          },

        //Email Groups
        // add email group
        {
          id: 8,
          screen_id: 3,
          module_id: 5,  
          privilege_id: 8,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Edit Email Group
        {
          id: 9,
          screen_id: 3,
          module_id: 6,  
          privilege_id: 9,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
         // delete Email Group
         {
          id: 10,
          screen_id: 3,
          module_id: 6,  
          privilege_id: 10,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
         // Deactivate Email Group
         {
          id: 11,
          screen_id: 3,
          module_id: 6,  
          privilege_id: 11,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Message Groups
        //Add Message Group
        {
          id: 12,
          screen_id: 4,
          module_id: 7,  
          privilege_id: 12,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
         //edit Message Group
         {
          id: 13,
          screen_id: 4,
          module_id: 8,  
          privilege_id: 13,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
         //delete Message Group
         {
          id: 14,
          screen_id: 4,
          module_id: 8,  
          privilege_id: 14,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Deactivate Message Group
        {
          id: 15,
          screen_id: 4,
          module_id: 8,  
          privilege_id: 15,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Templates
        // Add Templates
        {
          id: 16,
          screen_id: 5,
          module_id: 9,  
          privilege_id: 16,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // edit Templates
        {
          id: 17,
          screen_id: 5,
          module_id: 10,  
          privilege_id: 17,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
         // delete Templates
         {
          id: 18,
          screen_id: 5,
          module_id: 10,  
          privilege_id: 18,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
         // Duplicate Templates
         {
          id: 19,
          screen_id: 5,
          module_id: 10,  
          privilege_id: 19,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Campaign 
        // Create Campaign
        {
          id: 20,
          screen_id: 6,
          module_id: 11,  
          privilege_id: 20,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
         // Update Campaign
         {
          id: 21,
          screen_id: 6,
          module_id: 12,  
          privilege_id: 21,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // archive Campaign
        {
          id: 22,
          screen_id: 6,
          module_id: 12,  
          privilege_id: 22,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // delete Campaign
        {
          id: 23,
          screen_id: 6,
          module_id: 12,  
          privilege_id: 33,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Approve Campaign
        {
          id: 24,
          screen_id: 6,
          module_id: 12,  
          privilege_id: 34,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Members
        //Invite Members
        {
          id: 25,
          screen_id: 9,
          module_id: 13,  
          privilege_id: 23,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
         //Edit Members
         {
          id: 26,
          screen_id: 9,
          module_id: 14,  
          privilege_id: 24,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Settings
        //Identity Verification
        {
          id: 27,
          screen_id: 11,
          module_id: 16,  
          privilege_id: 25,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Delete Verification
        {
          id: 28,
          screen_id: 11,
          module_id: 16,  
          privilege_id: 26,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Add Role
        {
          id: 29,
          screen_id: 11,
          module_id: 17,  
          privilege_id: 27,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        //update Role
        {
          id: 30,
          screen_id: 11,
          module_id: 17,  
          privilege_id: 28,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        //delete Role
        {
          id: 31,
          screen_id: 11,
          module_id: 17,  
          privilege_id: 29,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
         //Add Testing Preferences
         {
          id: 32,
          screen_id: 11,
          module_id: 18,  
          privilege_id: 30,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        //update Testing Preferences
        {
          id: 33,
          screen_id: 11,
          module_id: 18,  
          privilege_id: 31,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        //delete Testing Preferences
        {
          id: 34,
          screen_id: 11,
          module_id: 18,  
          privilege_id: 32,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("screen_role_mappings", [], {});
  },
};