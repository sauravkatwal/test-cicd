'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION public.get_campaign_recipient_report_count(campaignid int4, messaging_platform varchar, from_date date, to_date date)
    RETURNS TABLE("key" varchar, "value" int8) AS $BODY$
      SELECT 'Sent'::varchar, COUNT(*)::int8 FROM (
        SELECT *
        FROM campaign_click_events cce
        INNER JOIN messaging_platforms mp ON mp.id = cce.messaging_platform_id 
        INNER JOIN email_registry_campaigns b ON cce.email_registry_campaign_id = b.id
        WHERE cce.event = 'Send' AND b.campaign_id = campaignid AND mp.slug = messaging_platform AND cce.created_at::DATE BETWEEN from_date AND to_date and cce.deleted_at is null
      ) AS count_table
      UNION ALL
      SELECT 'Delivered'::varchar, COUNT(*)::int8 FROM campaign_click_events cce
      INNER JOIN messaging_platforms mp ON mp.id = cce.messaging_platform_id 
      INNER JOIN email_registry_campaigns b ON cce.email_registry_campaign_id = b.id
      WHERE cce.event = 'Delivery' AND b.campaign_id = campaignid AND mp.slug = messaging_platform AND cce.created_at::DATE BETWEEN from_date AND to_date and cce.deleted_at is null
      UNION ALL
      SELECT 'Bounced'::varchar, COUNT(*)::int8 FROM email_registry_campaigns b
	    INNER JOIN campaign_schedules cs on cs.campaign_id = b.campaign_id
      INNER JOIN messaging_platforms mp ON mp.id = cs.messaging_platform_id 
      WHERE (
        (mp.slug = 'email' AND b.aws_ses_message_id is null)
        OR
        (mp.slug = 'viber' AND b.sparrow_viber_batch_id is null)
        OR
        (mp.slug = 'sms' AND b.sparrow_sms_message_id is null)
      ) AND mp.slug = messaging_platform AND b.campaign_id = campaignid AND b.created_at::DATE BETWEEN from_date AND to_date and b.deleted_at is null
      UNION ALL
      SELECT 'Opened'::varchar, COUNT(*)::int8 FROM campaign_click_events cce
      INNER JOIN messaging_platforms mp ON mp.id = cce.messaging_platform_id 
      INNER JOIN email_registry_campaigns b ON cce.email_registry_campaign_id = b.id
      WHERE cce.event = 'Open' AND b.campaign_id = campaignid AND mp.slug = messaging_platform AND cce.created_at::DATE BETWEEN from_date AND to_date and cce.deleted_at is null;
  $BODY$
  LANGUAGE SQL VOLATILE
  COST 100
  ROWS 1000;
    
  `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_campaign_recipient_report_count();
    `)
  }
};
