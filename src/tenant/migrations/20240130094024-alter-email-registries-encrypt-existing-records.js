'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('email_registries', 'name', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.changeColumn('email_registries', 'email', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.changeColumn('email_registries', 'phone_number', {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('email_registries', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('email_registries', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    });

    await queryInterface.changeColumn('email_registries', 'phone_number', {
      type: Sequelize.STRING,
    });
  },
};
