const { Pool } = require('pg');
const dbConfig = require('../config/db.config');

const pool = new Pool({
  connectionString: dbConfig.connectionString,
  ssl: dbConfig.ssl,
});

pool.on('error', (error) => {
  console.error('Unexpected database error', error);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
