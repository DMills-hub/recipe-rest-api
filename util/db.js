const Pool = require("pg").Pool;
const dotenv = require('dotenv');
dotenv.config();
let pool;
if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  pool = new Pool({
    user: process.env.DB_USER,
    host: "localhost",
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: false,
  });
}

module.exports = pool;
