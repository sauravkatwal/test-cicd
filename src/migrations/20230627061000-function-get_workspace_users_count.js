'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION public.get_workspace_users_count(workspaceid int, from_date date, to_date date)
    RETURNS TABLE("key" varchar, "value" int8) AS 
	$BODY$
		 select r.slug, count(*) from user_workspaces uw
		 inner join user_workspace_roles uwr on uwr.user_workspace_id = uw.id
		 inner join roles r on r.id = uwr.role_id
	  where uw.workspace_id = workspaceid
	  and uw.created_at::DATE BETWEEN from_date AND to_date
	  and uw.deleted_at is null
	  group by r.slug;
	$BODY$
  LANGUAGE SQL VOLATILE
  COST 100
  ROWS 1000
    
  `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_workspace_users_count();
    `)
  }
};
