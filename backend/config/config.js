require("dotenv").config();
const { parse } = require("pg-connection-string");

// Parse DATABASE_URL from .env
const dbUrl = process.env.DATABASE_URL;
const config = dbUrl ? parse(dbUrl) : {};

module.exports = {
  development: {
    username: config.user || "lenox",
    password: config.password || 'i love python 2024',
    database: config.database || "niims",
    host: config.host || "127.0.0.1",
    port: config.port || 5432,
    dialect: "postgres"
  },
  test: {
    ...this.development,
    database: "niims_test"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false
      }
    }
  }
};
