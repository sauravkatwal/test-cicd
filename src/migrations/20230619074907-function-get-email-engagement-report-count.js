'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_email_engagement_report_count"("campaignid" int4, "from_date" date, "to_date" date)
    RETURNS TABLE("date" date, "open_count" int4, "click_count" int4) AS $BODY$
    
  select 
	COALESCE(opened.dt::date, clicked.dt::date) AS date,
    COALESCE(opened.counts, 0) AS open_count,
    COALESCE(clicked.counts, 0) AS click_count
	from (SELECT
      cce.created_at::date as dt,
      COUNT(distinct cce.id) AS counts	
    FROM
      campaign_click_events cce
      INNER JOIN email_registry_campaigns erc ON cce.email_registry_campaign_id = erc.id
      INNER JOIN messaging_platforms mp ON mp.id = cce.messaging_platform_id
    WHERE cce.event = 'Open' AND
      erc.campaign_id = campaignid AND
	  mp.slug = 'email' AND
      cce.deleted_at IS NULL AND
      cce.created_at::DATE BETWEEN from_date::Date AND to_date::Date GROUP BY dt)opened
  FULL join (SELECT
      cce.created_at::date as dt,
      COUNT(distinct cce.id) AS counts	
    FROM
      campaign_click_events cce
      INNER JOIN email_registry_campaigns erc ON cce.email_registry_campaign_id = erc.id
      INNER JOIN messaging_platforms mp ON mp.id = cce.messaging_platform_id
    WHERE cce.event = 'Click' AND
      erc.campaign_id = campaignid AND
	  mp.slug = 'email' AND
      cce.deleted_at IS NULL AND
      cce.created_at::DATE BETWEEN from_date::Date AND to_date::Date GROUP BY dt)clicked on opened.dt = clicked.dt
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
    DROP FUNCTION IF EXISTS get_email_engagement_report_count();
    `)
  }
};
