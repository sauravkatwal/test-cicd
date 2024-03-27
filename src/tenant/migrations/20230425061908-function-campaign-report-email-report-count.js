'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION "public"."get_campaign_email_report_count"("campaign_id" int4, "from_date" date, "to_date" date)
    RETURNS TABLE("key" varchar, "value" int8) AS $BODY$
  
  select 'Sent' , count(1) from (select a.* from email_registry_campaigns a inner join email_registries b on a.email_registry_id  = b.id where b.status = 'sanitized' and b.sanitized_status = 'deliverable' and a.campaign_id = campaign_id and a.created_at::Date between from_date and to_date) as count_table
  union all
  select 'Delivered', count(1) from email_registry_campaigns a where a.aws_ses_message_id is not null and a.campaign_id = campaign_id and a.created_at::Date between from_date and to_date
  union all
  select 'Bounced', count(1)  from email_registry_campaigns a where a.campaign_id = campaign_id and a.aws_ses_message_id = NULL and a.created_at::Date between from_date and to_date
  union all
  select 'Opened', count(1) from campaign_click_events a inner join email_registry_campaigns b on a.email_registry_campaign_id = b.id  where a.event ='Open' and b.campaign_id = campaign_id and a.created_at::Date between from_date and to_date;
  
  $BODY$
    LANGUAGE sql VOLATILE
    COST 100
    ROWS 1000  
  `)

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_campaign_email_report_count();
    `)
  }
};
