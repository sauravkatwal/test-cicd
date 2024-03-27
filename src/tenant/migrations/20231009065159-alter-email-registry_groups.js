'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_registry_groups', 'group_code', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('email_registry_groups', 'group_code');
  },
};
