'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('email_registries', 'gender_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('email_registries', 'dob', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('email_registries', 'nationality_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('email_registries', 'province_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('email_registries', 'district_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('email_registries', 'municipality', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('email_registries', 'ward', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('email_registries', 'profession', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('email_registries', 'gender_id');
    await queryInterface.removeColumn('email_registries', 'dob');
    await queryInterface.removeColumn('email_registries', 'nationality_id');
    await queryInterface.removeColumn('email_registries', 'province_id');
    await queryInterface.removeColumn('email_registries', 'district_id');
    await queryInterface.removeColumn('email_registries', 'municipality');
    await queryInterface.removeColumn('email_registries', 'ward');
    await queryInterface.removeColumn('email_registries', 'profession');
  },
};