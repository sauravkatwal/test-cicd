'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeIndex('email_templates', 'email_templates_slug_workspace_id_status');
    await queryInterface.addIndex('email_templates', ['slug','workspace_id', 'messaging_platform'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'email_templates_slug_workspace_id_messaging_platform',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('email_templates', 'email_templates_slug_workspace_id_messaging_platform');
   
  },
};
