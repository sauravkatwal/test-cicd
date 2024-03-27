'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_campaign_overall_report_count"(
      campaignId INTEGER,
      from_date DATE,
      to_date DATE
      )
      RETURNS TABLE(
        "key" varchar,
        "value" int8
      )
        AS $BODY$
        select 'Email', count(*) from campaign_click_events a 
          inner join email_registry_campaigns b on a.email_registry_campaign_id = b.id 
          inner join messaging_platforms mp on a.messaging_platform_id = mp.id 
          where mp.name = 'E-mail' and b.campaign_id = campaignId and a.event = 'Send' and cast(a.created_at as Date) 
          between from_date and to_date and a.deleted_at is null
        union all
        select 'Whatsapp', count(*) from campaign_click_events a 
          inner join email_registry_campaigns b on a.email_registry_campaign_id = b.id 
          inner join messaging_platforms mp on a.messaging_platform_id = mp.id 
          where mp.name = 'WhatsApp' and b.campaign_id = campaignId and cast(a.created_at as Date) 			between from_date and to_date and a.deleted_at is null
        union all
        select 'Viber',  count(*) from campaign_click_events a 
          inner join email_registry_campaigns b on a.email_registry_campaign_id = b.id 
          inner join messaging_platforms mp on a.messaging_platform_id = mp.id 
          where mp.name = 'Viber' and b.campaign_id = campaignId and cast(a.created_at as Date) 			between from_date and to_date and a.deleted_at is null
        union all 
        select 'SMS',  count(*) from campaign_click_events a 
          inner join email_registry_campaigns b on a.email_registry_campaign_id = b.id 
          inner join messaging_platforms mp on a.messaging_platform_id = mp.id 
          where mp.name = 'SMS' and b.campaign_id = campaignId and cast(a.created_at as Date) 			between from_date and to_date and a.deleted_at is null
    $BODY$
    LANGUAGE sql VOLATILE
    COST 100
    ROWS 1000  
  `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_campaign_overall_report_count();
    `)
  }
};
