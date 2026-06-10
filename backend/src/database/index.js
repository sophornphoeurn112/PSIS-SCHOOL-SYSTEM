const { Pool } = require('pg');
const dbConfig = require('../config/db.config');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: dbConfig.connectionString,
  ssl: dbConfig.ssl,
});

// Log connection issues instead of crashing the whole process so the API can
// still serve requests (e.g. demo login) when the database is unavailable.
pool.on('error', (error) => {
  logger.error(`Unexpected database error: ${error.message}`);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
