'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_campaign_report_fallback_count"(  
        campaignId INTEGER,
        from_date DATE,
        to_date DATE
      )
      RETURNS TABLE (
        date DATE,
        fallback1_counts INTEGER,
        fallback2_counts INTEGER
      )
      AS $BODY$
      SELECT
        cce.created_at::date AS date,
        COUNT(DISTINCT CASE WHEN mp.name IN ('Viber', 'WhatsApp') THEN cce.id ELSE NULL END) AS fallback1_counts,
        COUNT(DISTINCT CASE WHEN mp.name = 'SMS' THEN cce.id ELSE NULL END) AS fallback2_counts
      FROM
        campaign_click_events cce
        INNER JOIN email_registry_campaigns erc ON cce.email_registry_campaign_id = erc.id
        INNER JOIN messaging_platforms mp ON cce.messaging_platform_id = mp.id
      WHERE 
        erc.campaign_id = campaignId AND
        cce.deleted_at IS NULL AND
        cce.created_at::date BETWEEN from_date::date AND to_date::date AND
        (mp.name IN ('Viber', 'WhatsApp') OR mp.name = 'SMS')
      GROUP BY date
      ORDER BY date;
          $BODY$
            LANGUAGE sql VOLATILE
            COST 100
            ROWS 1000  
  `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS get_campaign_report_fallback_count();
    `)
  }
};
