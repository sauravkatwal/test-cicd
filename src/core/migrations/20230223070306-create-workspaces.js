'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workspaces', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      secret: {
        type: Sequelize.STRING(27),
        allowNull: false,
      },
      owner_id: {
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
    await queryInterface.addIndex('workspaces', ['secret'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'workspaces_secret',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("workspaces", "workspaces_secret");
    await queryInterface.dropTable("workspaces");
  },
};
