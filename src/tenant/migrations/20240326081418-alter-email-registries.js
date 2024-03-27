'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('email_registries', 'name', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.addIndex('email_registries', ['name'], {
      concurrently: true,
      unique: false,
      name: 'email_registries_name',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('email_registries', 'email_registries_name');

    await queryInterface.changeColumn('email_registries', 'name', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
