/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TYPE "enum_user_workspaces_status" ADD VALUE 'deactivated'`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DELETE FROM pg_enum WHERE enumlabel = 'deactivated' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_user_workspaces_status')`,
    );
  },
};
