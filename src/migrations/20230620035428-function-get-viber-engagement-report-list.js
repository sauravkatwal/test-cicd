'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_viber_engagement_report_list"("campaignid" int4, "tracking_type" varchar, "from_date" date, "to_date" date, "search_query" TEXT)
    RETURNS TABLE("name" varchar, "phoneNumber" varchar, "email" varchar, "delivered" bool, "seen" bool) AS $BODY$
    
        SELECT
    er.name as name,
    er.phone_number as "phoneNumber",
    er.email as email,
    bool_or(cce.event = 'Delivery') AS delivered,
    bool_or(cce.event = 'Open') AS seen
    FROM
      campaign_click_events cce
	  INNER JOIN messaging_platforms mp ON mp.id = cce.messaging_platform_id 
      INNER JOIN email_registry_campaigns erc ON cce.email_registry_campaign_id = erc.id
    INNER JOIN email_registries er ON erc.email_registry_id = er.id 
    WHERE
      erc.campaign_id = campaignid AND
	  mp.slug = 'viber' AND
      cce.deleted_at IS NULL
      AND (
				search_query IS NULL OR search_query = '' 
				OR er.name ILIKE '%' || search_query || '%'
				OR er.email ILIKE '%' || search_query || '%'
				OR er.phone_number ILIKE '%' || search_query || '%'
			)
      AND cce.created_at::DATE BETWEEN from_date AND to_date
    GROUP BY
    er.name,
    er.phone_number,
    er.email
      HAVING
            tracking_type IS NULL OR tracking_type = '' OR tracking_type = 'Delivered' OR
            (tracking_type = 'Seen' AND array_length(array_agg(cce.event), 1) >= 2);
  $BODY$
    LANGUAGE sql VOLATILE
    COST 100
    ROWS 1000

  `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_viber_engagement_report_list();
    `)
  }
};
