'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('email_registries', 'status', {
      type: Sequelize.ENUM('sanitized', 'unsanitized'),
      allowNull: false,
      defaultValue: 'unsanitized',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('email_registries', 'status');
  },
};
