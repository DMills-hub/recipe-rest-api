const Pool = require("pg").Pool;
const dotenv = require('dotenv');
dotenv.config();
let pool;
if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    user: process.env.DB_PROD_USER,
    password: process.env.DB_PROD_PASSWORD,
    host: process.env.DB_PROD_HOST,
    database: process.env.DB_PROD_NAME,
    port: process.env.DB_PROD_PORT,
    ssl: false,
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
