'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION get_workspace_credits_usage_summary(
      workspaceid INTEGER,
      from_date DATE,
      to_date DATE
  )
  RETURNS TABLE (
      service_name VARCHAR(255),
      total_credits INTEGER,
      used_credits INTEGER,
      currently_available_credit INTEGER
  )
  AS $BODY$
      SELECT
          s.name AS service_name,
          COALESCE(SUM(t.credit), 0) AS total_credits,
          COALESCE(SUM(t.debit), 0) AS used_credits,
          COALESCE(SUM(t.credit), 0) - COALESCE(SUM(t.debit), 0) AS currently_available_credit    FROM
          transactions t
      JOIN
          services s ON t.service_id = s.id
      WHERE
          t.workspace_id = workspaceid
          AND t.transaction_date::DATE BETWEEN from_date AND to_date
      GROUP BY
          s.name;
  	$BODY$
  LANGUAGE SQL VOLATILE
  COST 100
  ROWS 1000
  `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_workspace_credits_usage_summary();
    `)
  }
};
