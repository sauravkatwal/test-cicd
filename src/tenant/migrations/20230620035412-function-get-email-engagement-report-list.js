'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const symmetricKey = process.env.ENCRYPTION_SYMMETRIC_KEY;
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_email_engagement_report_list"("campaignid" int4, "tracking_type" varchar, "from_date" date, "to_date" date, "search_query" TEXT, "page_offset" integer, "page_limit" integer)
    RETURNS TABLE("name" varchar, "phoneNumber" varchar, "email" varchar, "click" bool, "open" bool) AS $BODY$
    BEGIN
    RETURN QUERY
    WITH outer_query as (
    SELECT
    er.email as email,
    er.name as name,
    er.phone_number as phone_number,
    bool_or(cce.event = 'Click') AS click,
    bool_or(cce.event = 'Open') AS open,
    MAX(COALESCE(cce.created_at, erc.created_at)) AS "createdAt" 
    FROM
      campaign_click_events cce
    INNER JOIN messaging_platforms mp ON mp.id = cce.messaging_platform_id 
      INNER JOIN email_registry_campaigns erc ON cce.email_registry_campaign_id = erc.id
    INNER JOIN email_registries er ON erc.email_registry_id = er.id 
    WHERE
      erc.campaign_id = campaignid AND
    mp.slug = 'email' AND
    cce.event NOT IN ('Delivery', 'Send', 'Bounce') AND
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
    HAVING
      tracking_type IS NULL OR tracking_type = '' OR tracking_type = 'Open' OR
      (tracking_type = 'Click' AND bool_or(cce.event = 'Click') is true) 
    ORDER BY "createdAt" DESC
    LIMIT page_limit
    OFFSET page_offset
    )
    SELECT 		
      outer_query.name::VARCHAR as name, 
      pgp_sym_decrypt(outer_query.phone_number::bytea, '${symmetricKey}')::VARCHAR as "phoneNumber", 
      pgp_sym_decrypt(outer_query.email::bytea, '${symmetricKey}')::VARCHAR as email,
      outer_query."click" as click, 
      outer_query."open" as open
    FROM outer_query 
    LIMIT page_limit;

    END;

  $BODY$
  LANGUAGE plpgsql;

  `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_email_engagement_report_list();
    `)
  }
};
