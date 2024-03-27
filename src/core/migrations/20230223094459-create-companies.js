'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      registration_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("companies", ["registration_number"], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'companies_registration_number',
      where: {
        deleted_at: null,
      },
    });

    await queryInterface.addIndex("companies", ["user_id"],{
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'companies_user_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("companies", "companies_registration_number");
    await queryInterface.removeIndex("companies", "companies_user_id");
    await queryInterface.dropTable("companies");
  },
};
