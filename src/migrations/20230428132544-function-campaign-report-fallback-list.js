'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_email_lists_from_fallback"(
        campaignId INTEGER,
        fallback_level TEXT,
        from_date DATE,
        to_date DATE
      )
      RETURNS TABLE(
        name VARCHAR,
        phone_number VARCHAR,
        email VARCHAR,
        fallback_level VARCHAR,
        WhatsApp VARCHAR,
        Viber VARCHAR,
        SMS VARCHAR
      ) 
      AS $BODY$
    
      SELECT
        er.name as name,
        er.phone_number as phoneNumber,
        er.email as email,
        CASE WHEN mp.name IN ('Viber', 'WhatsApp') THEN 'level 1' ELSE 'level 2' END AS fallback_level,
        MAX(CASE WHEN mp.name = 'WhatsApp' THEN cce.event END) AS WhatsApp, 
        MAX(CASE WHEN mp.name = 'Viber' THEN cce.event END) AS Viber,
        MAX(CASE WHEN mp.name = 'SMS' THEN cce.event END) AS SMS
      FROM
        campaign_click_events cce
        INNER JOIN email_registry_campaigns erc ON cce.email_registry_campaign_id = erc.id
	      INNER JOIN messaging_platforms mp ON cce.messaging_platform_id = mp.id
        INNER JOIN email_registries er ON erc.email_registry_id = er.id 
      WHERE
        erc.campaign_id = campaignId AND
	      mp.name <> 'E-mail' AND
        (
          fallback_level IS NULL OR fallback_level = '' OR 
	        (fallback_level = 'one' AND mp.name IN ('Viber', 'WhatsApp'))	OR
          (fallback_level = 'two' AND mp.name = 'SMS') 
        ) AND
        erc.deleted_at IS NULL AND
        er.deleted_at IS NULL AND
        er.created_at::Date BETWEEN from_date AND to_date
      GROUP BY
        er.name,
        er.phone_number,
        er.email,
        CASE WHEN mp.name IN ('Viber', 'WhatsApp') THEN 'level 1' ELSE 'level 2' END;
      $BODY$
        LANGUAGE sql VOLATILE
        COST 100
        ROWS 1000
  
  
  `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_email_lists_from_fallback();
    `)
  }
};
