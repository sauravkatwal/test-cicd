/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: 1,
          label: "Owner",
          slug: "owner",
          level: 0,
          is_default: true,
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
