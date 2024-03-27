'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_email_lists_from_campaign_report"(  
      campaignId INTEGER,
      report_type TEXT,
      from_date DATE,
      to_date DATE
    )
    RETURNS TABLE (
      email VARCHAR,
      name VARCHAR,
      phoneNumber VARCHAR,
      emailState VARCHAR,
      id int[]
    )
    AS $BODY$
      SELECT
        er.email,
        er.name,
        er.phone_number,
        CASE 
          WHEN array_agg(cce.id) IS NOT NULL AND array_length(array_remove(array_agg(cce.id), NULL), 1) > 0 AND erc.aws_ses_message_id IS NOT NULL THEN 'Opened'
          WHEN erc.aws_ses_message_id IS NOT NULL THEN 'Delivered'
          WHEN erc.aws_ses_message_id IS NULL THEN 'Bounced'
          END AS email_state,
        array_agg(cce.id) AS aggregated_column
      FROM
        email_registry_campaigns erc 
        INNER JOIN email_registries er ON erc.email_registry_id = er.id
        LEFT JOIN campaign_click_events cce ON erc.id = cce.email_registry_campaign_id
      WHERE
        erc.campaign_id = campaignId AND
        (
          report_type IS NULL OR report_type = '' OR report_type = 'sent' OR
          (report_type = 'delivered' AND erc.aws_ses_message_id IS NOT NULL) OR
          (report_type = 'bounced' AND erc.aws_ses_message_id IS NULL) OR
          (report_type = 'opened' AND cce.id IS NOT NULL)
        ) AND
        erc.deleted_at IS NULL AND
        er.deleted_at IS NULL AND
        er.created_at::Date BETWEEN from_date AND to_date
                GROUP BY
            er.email,
            er.name,
            er.phone_number,
            erc.aws_ses_message_id;
          $BODY$
            LANGUAGE sql VOLATILE
            COST 100
            ROWS 1000  
  `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS get_email_lists_from_campaign_report();
    `)
  }
};
