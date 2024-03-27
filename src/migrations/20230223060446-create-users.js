'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sub: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      phone_number_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      confirmation_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      account_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    
    
    await queryInterface.addIndex('users', ['email'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'users_email',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("users", "users_email");
    await queryInterface.dropTable("users");
  },
};
