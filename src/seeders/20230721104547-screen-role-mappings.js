/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "screen_role_mappings",
      [
        // View Dashboard 
        {
          id:35,
          screen_id: 1,
          module_id: 23,  
          privilege_id: 35,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }, 
        
        // Customer List view
        {
          id: 36,
          screen_id: 2,
          module_id: 24,  
          privilege_id: 36,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },

        //Email Groups view
       
        {
          id: 37,
          screen_id: 3,
          module_id: 25,  
          privilege_id: 37,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
    
        // Message Groups view
        {
          id: 38,
          screen_id: 4,
          module_id: 26,  
          privilege_id: 38,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        
        // Templates view
        {
          id: 39,
          screen_id: 5,
          module_id: 27,  
          privilege_id: 39,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
       
        // Campaign  
        {
          id: 40,
          screen_id: 6,
          module_id: 28,  
          privilege_id: 45,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 41,
          screen_id: 6,
          module_id: 11,  
          privilege_id: 46,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 42,
          screen_id: 6,
          module_id: 11,  
          privilege_id: 47,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 43,
          screen_id: 6,
          module_id: 11,  
          privilege_id: 48,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 44,
          screen_id: 6,
          module_id: 11,  
          privilege_id: 49,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 45,
          screen_id: 6,
          module_id: 11,  
          privilege_id: 50,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 46,
          screen_id: 6,
          module_id: 11,  
          privilege_id: 51,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        //Newsletter
        {
          id: 47,
          screen_id: 7,
          module_id: 29,  
          privilege_id: 40,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
       //Campaign Report
       {
        id: 48,
        screen_id: 8,
        module_id: 30,  
        privilege_id: 41,
        role_id: 1,
        is_default: true,
        is_published: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
        //Members
        {
          id: 49,
          screen_id: 9,
          module_id: 31,  
          privilege_id: 42,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
         //Support
         {
          id: 50,
          screen_id: 10,
          module_id: 32,  
          privilege_id: 43,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Settings
        {
          id: 51,
          screen_id: 11,
          module_id: 33,  
          privilege_id: 44,
          role_id: 1,
          is_default: true,
          is_published: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Approve Template
        {
          id: 52,
          screen_id: 5,
          module_id: 10,  
          privilege_id: 52,
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