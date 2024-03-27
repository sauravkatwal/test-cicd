'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const symmetricKey = process.env.ENCRYPTION_SYMMETRIC_KEY;

    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_recipients_lists_from_campaign_report"(
			campaignId INTEGER,
			report_type TEXT,
			messaging_platform TEXT,
			from_date DATE,
			to_date DATE,
			search_query TEXT,
			page_offset integer, 
			page_limit integer
	)
	RETURNS TABLE (
			"id" INT,
			"email" VARCHAR,
			"name" VARCHAR,
			"phoneNumber" VARCHAR,
			"createdAt" DATE,
			"emailState" TEXT
	)
	AS $BODY$
	BEGIN
		RETURN QUERY
		WITH outer_query as (
		SELECT 
		cce.id,
		er.email as email,
		er.name as name,
		er.phone_number as phone_number,
		COALESCE(cce.created_at, erc.created_at)::DATE AS createdAt,
		COALESCE(cce.updated_at, erc.updated_at) AS updatedAt,
			CASE 
				WHEN cce.event = 'Open' THEN 'Opened'
				WHEN cce.event = 'Delivery' THEN 'Delivered'
				WHEN cce.event = 'Send' THEN 'Sent'
				WHEN cce.event = 'Click' THEN 'Clicked'
				WHEN cce.event IS NULL AND (
					(messaging_platform = 'email' AND erc.aws_ses_message_id IS NULL) OR
					(messaging_platform = 'viber' AND erc.sparrow_viber_batch_id IS NULL) OR
					(messaging_platform = 'sms' AND erc.sparrow_sms_message_id IS NULL)
					) THEN 'Bounced'
				END AS "emailState"
		FROM email_registry_campaigns erc
		INNER JOIN email_registries er ON erc.email_registry_id = er.id
		INNER JOIN campaign_schedules cs ON cs.campaign_id = erc.campaign_id
		LEFT JOIN campaign_click_events cce ON cce.email_registry_campaign_id = erc.id
		LEFT JOIN messaging_platforms mp ON mp.id = COALESCE(cce.messaging_platform_id, cs.messaging_platform_id)
		WHERE
				mp.slug = messaging_platform AND
				erc.campaign_id = campaignId AND
				(
						report_type IS NULL OR report_type = '' OR
						(report_type = 'sent' AND cce.event = 'Send') OR
						(report_type = 'delivered' AND cce.event = 'Delivery') OR
						(report_type = 'clicked' AND cce.event = 'Click') OR
						(report_type = 'bounced' AND (
								(messaging_platform = 'email' AND (erc.aws_ses_message_id IS NULL AND cce.event IS NULL)) OR
								(messaging_platform = 'viber' AND (erc.sparrow_viber_batch_id IS NULL AND cce.event IS NULL)) OR
								(messaging_platform = 'sms' AND erc.sparrow_sms_message_id IS NULL)
						)) OR
						(report_type = 'opened' AND cce.event = 'Open')
				) AND
				(
						search_query IS NULL OR search_query = ''
						OR er.name ILIKE '%' || search_query || '%'
				) AND
				COALESCE(cce.created_at, erc.created_at)::DATE BETWEEN from_date AND to_date AND
				COALESCE(cce.deleted_at, erc.deleted_at)::DATE IS NULL
		ORDER BY updatedAt DESC
		LIMIT page_limit
		OFFSET page_offset
		)
		SELECT 		
			outer_query.id as id,
			pgp_sym_decrypt(outer_query.email::bytea, '${symmetricKey}')::VARCHAR as email,
			outer_query.name::VARCHAR as name, 
			pgp_sym_decrypt(outer_query.phone_number::bytea, '${symmetricKey}')::VARCHAR as phone_number, 
			outer_query.createdAt, 
			outer_query."emailState" 
		FROM outer_query 
		LIMIT page_limit;
		END;
		$BODY$
		LANGUAGE plpgsql;
		`)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_recipients_lists_from_campaign_report();
    `)
  }
};
