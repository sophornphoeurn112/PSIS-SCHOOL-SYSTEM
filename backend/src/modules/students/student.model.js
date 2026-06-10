const db = require('../../database');

const COLUMNS = `id,
  school_id AS "schoolId",
  name,
  name_khmer AS "nameKhmer",
  username,
  gender,
  date_of_birth AS "dateOfBirth",
  date_joined AS "dateJoined",
  phone,
  status,
  created_at AS "createdAt"`;

exports.findAll = async () => {
  const result = await db.query(`SELECT ${COLUMNS} FROM students ORDER BY id`);
  return result.rows;
};

exports.findById = async (id) => {
  const result = await db.query(`SELECT ${COLUMNS} FROM students WHERE id = $1`, [id]);
  return result.rows[0];
};

exports.create = async (s) => {
  const result = await db.query(
    `INSERT INTO students
       (school_id, name, name_khmer, username, gender, date_of_birth, date_joined, phone, password, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, 'active'))
     RETURNING ${COLUMNS}`,
    [s.schoolId, s.name, s.nameKhmer, s.username, s.gender, s.dateOfBirth, s.dateJoined, s.phone, s.password, s.status],
  );
  return result.rows[0];
};

exports.update = async (id, s) => {
  const result = await db.query(
    `UPDATE students SET
       school_id = COALESCE($2, school_id),
       name = COALESCE($3, name),
       name_khmer = COALESCE($4, name_khmer),
       username = COALESCE($5, username),
       gender = COALESCE($6, gender),
       date_of_birth = COALESCE($7, date_of_birth),
       date_joined = COALESCE($8, date_joined),
       phone = COALESCE($9, phone),
       status = COALESCE($10, status)
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [id, s.schoolId, s.name, s.nameKhmer, s.username, s.gender, s.dateOfBirth, s.dateJoined, s.phone, s.status],
  );
  return result.rows[0];
};

exports.remove = async (id) => {
  const result = await db.query(`DELETE FROM students WHERE id = $1 RETURNING id`, [id]);
  return result.rows[0];
};
