'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('default_email_templates', 'messaging_platform', {
      type: Sequelize.ENUM('email', 'whatsapp', 'viber', 'sms'),
      allowNull: false,
      defaultValue: "email",
    });
    await queryInterface.removeIndex('default_email_templates', 'default_email_templates_slug');
    await queryInterface.addIndex('default_email_templates', ['slug', 'messaging_platform'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'default_email_templates_slug_messaging_platform',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('default_email_templates', 'messaging_platform');
    await queryInterface.removeIndex('default_email_templates', 'default_email_templates_slug_messaging_platform');
  },
};