'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_sms_engagement_report_count"("campaignid" int4, "from_date" date, "to_date" date)
    RETURNS TABLE("date" date, "delivery_count" int4) AS $BODY$
    
  select delivered.dt::date as date, delivered.counts as delivery_count from (SELECT
      cce.created_at::date as dt,
      COUNT(distinct cce.id) AS counts	
    FROM
      campaign_click_events cce
      INNER JOIN email_registry_campaigns erc ON cce.email_registry_campaign_id = erc.id
      INNER JOIN messaging_platforms mp ON mp.id = cce.messaging_platform_id
    WHERE cce.event = 'Delivery' AND
      erc.campaign_id = campaignid AND
      mp.slug = 'sms' AND
      cce.deleted_at IS NULL AND
      cce.created_at::DATE BETWEEN from_date::Date AND to_date::Date GROUP BY dt)delivered
    ORDER BY
      date asc;
      
      $BODY$
    LANGUAGE sql VOLATILE
    COST 100
    ROWS 1000

  `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_sms_engagement_report_count();
    `)
  }
};
