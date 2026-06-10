const db = require('../../database');

exports.findAll = async () => {
  const result = await db.query('SELECT id, email, role, created_at FROM users');
  return result.rows;
};

exports.findById = async (id) => {
  const result = await db.query('SELECT id, email, role, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
};
