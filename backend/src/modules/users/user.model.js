const db = require('../../database');

exports.findAll = async () => {
  const result = await db.query('SELECT id, username, role, name, email, created_at FROM users ORDER BY id');
  return result.rows;
};

exports.findById = async (id) => {
  const result = await db.query(
    'SELECT id, username, role, name, email, created_at FROM users WHERE id = $1',
    [id],
  );
  return result.rows[0];
};

exports.findByUsername = async (username) => {
  const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

exports.create = async ({ username, passwordHash, role, name, email }) => {
  const result = await db.query(
    `INSERT INTO users (username, password_hash, role, name, email)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, username, role, name, email, created_at`,
    [username, passwordHash, role, name, email],
  );
  return result.rows[0];
};
