'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('comments', 'created_by_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user_workspaces',
        key: 'id',
      },
    });
  
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('comments', 'created_by_id');
  },
};