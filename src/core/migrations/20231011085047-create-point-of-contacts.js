'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('point_of_contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      workspace_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      job_title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      job_position: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex("point_of_contacts", ["workspace_id"], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'point_of_contacts_workspace_id',
      where: {
        deleted_at: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("point_of_contacts", "point_of_contacts_workspace_id");
    await queryInterface.dropTable('point_of_contacts');
  }
};