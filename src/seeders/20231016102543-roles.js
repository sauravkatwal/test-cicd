/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: 2,
          label: "Administrator",
          slug: "administrator",
          level: 10,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", [], {});
  },
};
