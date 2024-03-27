'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_recipients_lists_from_campaign_report"(  
      campaignId INTEGER,
      report_type TEXT,
	  messaging_platform TEXT,
      from_date DATE,
      to_date DATE,
	  search_query TEXT
    )
    RETURNS TABLE (
      email VARCHAR,
      name VARCHAR,
      "phoneNumber" VARCHAR,
	  "createdAt" DATE,
      "emailState" VARCHAR
    )
    AS $BODY$
		Select 
			er.email,
			er.name,
			er.phone_number,
			COALESCE(cce.created_at, erc.created_at) AS createdAt,
		case 
			WHEN cce.event = 'Open' then 'Opened'
			WHEN cce.event = 'Delivery' then 'Delivered'
			WHEN cce.event = 'Send' then 'Sent'
			WHEN cce.event = 'Click' then 'Clicked'
			WHEN erc.aws_ses_message_id is null then 'Bounced'

		END as email_state
		from email_registry_campaigns erc
		inner join email_registries er on erc.email_registry_id = er.id
		inner join campaign_schedules cs on cs.campaign_id = erc.campaign_id
		left join campaign_click_events cce on cce.email_registry_campaign_id = erc.id
		left join messaging_platforms mp on mp.id = COALESCE(cce.messaging_platform_id, cs.messaging_platform_id)
	where
			mp.slug = messaging_platform and
			erc.campaign_id = campaignId
			AND
			(
			  report_type IS NULL OR report_type = ''  OR
			  (report_type = 'sent' AND cce.event = 'Send' ) OR
			  (report_type = 'delivered' AND cce.event = 'Delivery') OR
			  (report_type = 'clicked' AND cce.event = 'Click') OR
			  (report_type = 'bounced' and erc.aws_ses_message_id is null) OR
			  (report_type = 'opened' AND cce.event = 'Open')
			)
			AND (
				search_query IS NULL OR search_query = '' 
				OR er.name ILIKE '%' || search_query || '%'
				OR er.email ILIKE '%' || search_query || '%'
				OR er.phone_number ILIKE '%' || search_query || '%'
			)
			AND COALESCE(cce.created_at, erc.created_at)::date between from_date and to_date
			AND COALESCE(cce.deleted_at, erc.deleted_at)::date is null
		ORDER BY createdAt
          $BODY$
            LANGUAGE sql VOLATILE
            COST 100
            ROWS 1000
  `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_recipients_lists_from_campaign_report();
    `)
  }
};
