'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const encryption = {
      symmetricKey: process.env.ENCRYPTION_SYMMETRIC_KEY,
      compressAlgorithm: process.env.ENCRYPTION_COMPRESS_ALGORITHM,
      cipherAlgorithm: process.env.ENCRYPTION_CIPHER_ALGORITHM,
    };

    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION encrypt_email_registry_columns()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'UPDATE' AND NEW.deleted_at IS NULL THEN
          IF NEW.email IS DISTINCT FROM OLD.email THEN
            NEW.email = pgp_sym_encrypt(NEW.email, '${encryption.symmetricKey}', 'compress-algo=${encryption.compressAlgorithm}, cipher-algo=${encryption.cipherAlgorithm}');	
          END IF;
          IF NEW.phone_number IS DISTINCT FROM OLD.phone_number THEN
            NEW.phone_number = pgp_sym_encrypt(NEW.phone_number, '${encryption.symmetricKey}', 'compress-algo=${encryption.compressAlgorithm}, cipher-algo=${encryption.cipherAlgorithm}');
          END IF;
          RETURN NEW;
        ELSIF TG_OP = 'INSERT' THEN
          NEW.email = pgp_sym_encrypt(NEW.email, '${encryption.symmetricKey}', 'compress-algo=${encryption.compressAlgorithm}, cipher-algo=${encryption.cipherAlgorithm}');
          NEW.phone_number = pgp_sym_encrypt(NEW.phone_number, '${encryption.symmetricKey}', 'compress-algo=${encryption.compressAlgorithm}, cipher-algo=${encryption.cipherAlgorithm}');
          RETURN NEW;
        ELSE 
          RETURN NEW;
        END IF;
      END;
      $$
      LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_encrypt_email_registry
      BEFORE INSERT OR UPDATE 
      ON email_registries
      FOR EACH ROW
      EXECUTE FUNCTION encrypt_email_registry_columns();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_encrypt_email_registry ON email_registries;
    `);
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS encrypt_email_registry_columns();
    `);
    await queryInterface.sequelize.query(`
      DROP EXTENSION IF EXISTS pgcrypto;
    `);
  },
};
