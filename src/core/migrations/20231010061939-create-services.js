'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
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
    await queryInterface.addIndex("services", ["slug"], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'services_slug',
      where: {
        deleted_at: null,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("services", "services_slug");
    await queryInterface.dropTable('services');
  }
};


