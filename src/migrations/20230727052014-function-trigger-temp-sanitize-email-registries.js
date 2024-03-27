'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION function_update_email_registry_sanitization()
    RETURNS TRIGGER AS
    $$
    BEGIN
        UPDATE email_registries
        SET
            status = 'sanitized'::public.enum_email_registries_status,
            sanitized_status = NEW.sanitized_status::public.enum_email_registries_sanitized_status,
            sanitized_reason = NEW.sanitized_reason::public.enum_email_registries_sanitized_reason,
            sanitized_response = NEW.sanitized_response,
            email_verified = NEW.email_verified
        WHERE email = NEW.email AND workspace_id = NEW.workspace_id;
        DELETE FROM temp_sanitize_email_registries
        WHERE id = NEW.id;
        RETURN NEW;
    END;
    $$
    LANGUAGE plpgsql;`);

    await queryInterface.sequelize.query(`CREATE TRIGGER trigger_update_email_registry
    AFTER INSERT
    ON temp_sanitize_email_registries
    FOR EACH ROW
    EXECUTE FUNCTION function_update_email_registry_sanitization();;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP TRIGGER IF EXISTS trigger_update_email_registry ON temp_sanitize_email_registries;
    `);

    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS function_update_email_registry_sanitization();
    `);
  },
};
