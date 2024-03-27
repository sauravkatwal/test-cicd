require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER_TENANT,
    password: process.env.DB_PASSWORD_TENANT,
    database: process.env.DB_NAME_TENANT,
    host: process.env.DB_HOST_TENANT,
    dialect: process.env.DB_DIALECT_TENANT,
  },
  staging: {
    username: process.env.DB_USER_TENANT,
    password: process.env.DB_PASSWORD_TENANT,
    database: process.env.DB_NAME_TENANT,
    host: process.env.DB_HOST_TENANT,
    dialect: process.env.DB_DIALECT_TENANT,
  },
  test: {
    username: process.env.DB_USER_TENANT,
    password: process.env.DB_PASSWORD_TENANT,
    database: process.env.DB_NAME_TENANT,
    host: process.env.DB_HOST_TENANT,
    dialect: process.env.DB_DIALECT_TENANT,
  },
  production: {
    username: process.env.DB_USER_TENANT,
    password: process.env.DB_PASSWORD_TENANT,
    database: process.env.DB_NAME_TENANT,
    host: process.env.DB_HOST_TENANT,
    dialect: process.env.DB_DIALECT_TENANT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  },
};
