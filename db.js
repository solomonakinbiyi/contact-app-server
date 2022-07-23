const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
  database: process.env.DATABASE,
});

module.exports = pool;