'use strict';
require('dotenv').config();
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    const dbPort = process.env.DB_PORT;

    const connection_string = `host=${dbHost} dbname=${dbName} user=${dbUser} password=${dbPassword} port=${dbPort}`;

    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS dblink;`);


    await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION public.get_workspace_users_count(workspaceid int, from_date date, to_date date)
        RETURNS TABLE("key" varchar, "value" int8) AS
    $BODY$
    DECLARE
        connection_string text;
    BEGIN
        connection_string := '${connection_string}';
        
        RETURN QUERY
        SELECT r.slug, count(*)::int8 AS value
        FROM user_workspace_roles uwr
        INNER JOIN (
            SELECT *
            FROM dblink(connection_string, '
                SELECT id
                FROM user_workspaces
                WHERE workspace_id = ' || workspaceid || '
                AND created_at::DATE BETWEEN ''' || from_date || ''' AND ''' || to_date || '''
                AND deleted_at IS NULL
            ') AS results("id" int8)) as ur
        ON ur.id = uwr.user_workspace_id
        INNER JOIN roles r ON r.id = uwr.role_id
        GROUP BY r.slug;
    END
    $BODY$
    LANGUAGE plpgsql VOLATILE
    COST 100
    ROWS 1000;`);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS get_workspace_users_count();
    `);
    await queryInterface.sequelize.query(`
      DROP EXTENSION IF EXISTS dblink;
    `);
  },
};
