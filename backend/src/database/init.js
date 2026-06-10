// Initialises the database: creates tables from schema.sql and seeds default
// accounts. Safe to run multiple times (idempotent upserts).
//
// Usage: npm run db:init
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./index');
const { hashPassword } = require('../utils/password');
const logger = require('../utils/logger');

const DEFAULT_USERS = [
  { username: 'admin', password: 'Admin123', role: 'admin', name: 'Admin', email: 'admin@school.com' },
  { username: 'teacher', password: 'Teacher123', role: 'teacher', name: 'Mr. John', email: 'teacher@school.com' },
  { username: 'staff', password: 'Staff123', role: 'staff', name: 'Staff Member', email: 'staff@school.com' },
  { username: 'student', password: 'Student123', role: 'student', name: 'John Smith', email: 'student@school.com' },
];

const DEFAULT_STUDENTS = [
  {
    schoolId: 'STD001', name: 'Ali Ahmed', nameKhmer: 'អាលី អាហ្មែត', username: 'ali123',
    gender: 'Male', dateOfBirth: '2008-06-12', dateJoined: '2022-09-01', phone: '0123456789',
    password: 'Welcome@123', status: 'active',
  },
  {
    schoolId: 'STD002', name: 'Fatima Khan', nameKhmer: 'ហ្វាទីមា ខាន', username: 'fatima456',
    gender: 'Female', dateOfBirth: '2009-03-22', dateJoined: '2023-01-15', phone: '0987654321',
    password: 'Welcome@123', status: 'active',
  },
];

const run = async () => {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await db.query(schema);
  logger.info('Schema applied.');

  for (const user of DEFAULT_USERS) {
    const passwordHash = await hashPassword(user.password);
    await db.query(
      `INSERT INTO users (username, password_hash, role, name, email)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             role = EXCLUDED.role,
             name = EXCLUDED.name,
             email = EXCLUDED.email`,
      [user.username, passwordHash, user.role, user.name, user.email],
    );
  }
  logger.info(`Seeded ${DEFAULT_USERS.length} users.`);

  for (const s of DEFAULT_STUDENTS) {
    await db.query(
      `INSERT INTO students
         (school_id, name, name_khmer, username, gender, date_of_birth, date_joined, phone, password, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (school_id) DO NOTHING`,
      [s.schoolId, s.name, s.nameKhmer, s.username, s.gender, s.dateOfBirth, s.dateJoined, s.phone, s.password, s.status],
    );
  }
  logger.info(`Seeded ${DEFAULT_STUDENTS.length} students.`);
};

run()
  .then(() => {
    logger.info('Database initialisation complete.');
    return db.pool.end();
  })
  .catch((error) => {
    logger.error(`Database initialisation failed: ${error.message}`);
    process.exit(1);
  });
