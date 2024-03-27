'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeIndex('email_registry_groups', 'email_registry_groups_slug_workspace_id');
    await queryInterface.addIndex('email_registry_groups', ['slug','workspace_id','type'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'email_registry_groups_slug_workspace_id_type',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('email_registry_groups', 'email_registry_groups_slug_workspace_id_type');
   
  },
};
