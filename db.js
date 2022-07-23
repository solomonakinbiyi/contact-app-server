const Pool = require("pg").Pool;

const devConfig = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
};

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  // connectionString: process.env.PG_DATABASE,
  // ssl: true,
  // dialect: "postgres",
  // dialectOptions: {
  //   ssl: { require: true },
  // },
  // user: process.env.PG_USER,
  // password: process.env.PG_PASSWORD,
  // host: process.env.PG_HOST,
  // database: process.env.PG_DATABASE,
  // port: process.env.PG_PORT,
};

const pool = new Pool(
  process.env.NODE_ENV === "production" ? proConfig : devConfig
);

module.exports = pool;
