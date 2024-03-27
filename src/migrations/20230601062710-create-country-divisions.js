'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('country_divisions', {
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
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.INTEGER,
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'country_divisions',
          key: 'id',
        },
      },
      district: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
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
        allowNull: true,
      },
    });

    await queryInterface.addIndex('country_divisions', {
      unique: true,
      name: 'country_divisions_slug_type',
      fields: ['slug', 'type'],
      where: {
        deleted_at: null,
      },
    });

    // await queryInterface.addConstraint('country_divisions', {
    //   fields: ['state'],
    //   type: 'foreign key',
    //   references: {
    //     table: 'country_divisions',
    //     field: 'id',
    //   },
    //   onDelete: 'cascade',
    //   onUpdate: 'cascade',
    //   name: 'country_divisions_state_foreign_key',
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('country_divisions', 'country_divisions_state_foreign_key');
    await queryInterface.dropTable('country_divisions');
  }
};
