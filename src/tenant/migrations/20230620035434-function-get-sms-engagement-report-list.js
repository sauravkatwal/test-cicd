'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const symmetricKey = process.env.ENCRYPTION_SYMMETRIC_KEY;
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_sms_engagement_report_list"("campaignid" int4, "tracking_type" varchar, "from_date" date, "to_date" date, "search_query" TEXT, "page_offset" integer, "page_limit" integer)
    RETURNS TABLE(
	  "name" varchar,
		"phoneNumber" varchar,
		"email" varchar,
		"delivered" bool
	) AS $BODY$
  BEGIN
  RETURN QUERY
  WITH outer_query as (
    SELECT
        er.name as "name",
        er.phone_number as "phone_number",
        er.email as "email",
        bool_or(cce.event = 'Delivery') AS delivered,
        MAX(COALESCE(cce.created_at, erc.created_at)) AS "createdAt"
    FROM
      campaign_click_events cce
	  INNER JOIN messaging_platforms mp ON mp.id = cce.messaging_platform_id 
      INNER JOIN email_registry_campaigns erc ON cce.email_registry_campaign_id = erc.id
    INNER JOIN email_registries er ON erc.email_registry_id = er.id 
    WHERE
      erc.campaign_id = campaignid AND
	  mp.slug = 'sms' AND
      cce.deleted_at IS NULL
      AND (
				search_query IS NULL OR search_query = '' 
				OR er.name ILIKE '%' || search_query || '%'
			)
      AND cce.created_at::DATE BETWEEN from_date AND to_date
    GROUP BY
      er.name,
      er.phone_number,
      er.email
    ORDER BY "createdAt" DESC
    LIMIT page_limit
    OFFSET page_offset
    )
    SELECT 		
      outer_query.name::VARCHAR as name, 
      pgp_sym_decrypt(outer_query.phone_number::bytea, '${symmetricKey}')::VARCHAR as "phoneNumber", 
      pgp_sym_decrypt(outer_query.email::bytea, '${symmetricKey}')::VARCHAR as email,
      outer_query."delivered" as delivered
    FROM outer_query 
    LIMIT page_limit;

    END;

  $BODY$
  LANGUAGE plpgsql;

  `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_sms_engagement_report_list();
    `)
  }
};
