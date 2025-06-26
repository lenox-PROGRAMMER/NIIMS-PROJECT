const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// PostgreSQL connection pool config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

//  Diagnostics (optional in dev)
pool.on("connect", () => {
  console.log(" Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error(" PostgreSQL pool error:", err.message);
});

module.exports = pool;
