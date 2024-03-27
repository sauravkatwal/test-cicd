'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION public.get_campaign_type_report_count(workspaceid int, from_date date, to_date date)
    RETURNS TABLE("key" varchar, "value" int8) AS 
	$BODY$
      select  mp.slug,  count(*) from campaigns c
      inner join campaign_schedules cs on cs.campaign_id = c.id
      inner join messaging_platforms mp on mp.id = cs.messaging_platform_id
      where cs.campaign_id is not null and 
      c.is_archive is false and
      c.deleted_at is null and
      c.workspace_id = workspaceid and
      c.created_at::DATE BETWEEN from_date AND to_date
      group by mp.slug;

	$BODY$
  LANGUAGE SQL VOLATILE
  COST 100
  ROWS 1000

  `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_campaign_type_report_count();
    `)
  }
};
