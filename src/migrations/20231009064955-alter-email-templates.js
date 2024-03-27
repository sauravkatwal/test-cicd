'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_templates', 'template_code', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('email_templates', 'template_code');
  },
};
