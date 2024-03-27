'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION get_workspace_credits_usage_details(
      workspaceid INTEGER,
      from_date DATE,
      to_date DATE,
      service VARCHAR(255)
  ) RETURNS TABLE (
      transaction_date DATE,
      transaction_time VARCHAR(255),
      used_credits INTEGER
  ) AS $BODY$
      SELECT
          transaction_date AS transaction_date,
          TO_CHAR(transaction_date, 'HH24:MI:SS') AS transaction_time,
          COALESCE(SUM(debit), 0) AS used_credits
      FROM
          transactions
          JOIN services s ON s.id = transactions.service_id
      WHERE
          transactions.workspace_id = workspaceid
          AND s.slug = service
          AND debit IS NOT NULL
          AND transaction_date::DATE BETWEEN from_date AND to_date
      GROUP BY
          TO_CHAR(transaction_date, 'HH24:MI:SS'),
          transaction_date;
  $BODY$ 
  LANGUAGE SQL VOLATILE
  COST 100
  ROWS 1000
  
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_workspace_credits_usage_details();
    `)
  }
};
