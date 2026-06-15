// Initialises the database: creates tables from schema.sql and seeds default
// accounts/data. Seeding only runs when a table is empty, so re-running does
// not wipe data you created in the app.
//
// Usage: npm run db:init
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./index');
const storeModel = require('../modules/store/store.model');
const { hashPassword } = require('../utils/password');
const logger = require('../utils/logger');

const DEFAULT_USERS = [
  { username: 'admin', password: 'Admin123', role: 'admin', name: 'Admin', email: 'admin@school.com' },
];

const DEFAULT_TEACHERS = [
  {
    id: 1, schoolId: 'TCH001', name: 'Mr. John Smith', nameKhmer: 'លោក ជន ស្មីត',
    username: 'john123', email: 'john@school.com', subject: 'Mathematics', gender: 'Male',
    dateOfBirth: '1980-05-10', dateJoined: '2010-08-15', phone: '0123456789',
    status: 'active', role: 'teacher', password: 'Welcome@123',
  },
  {
    id: 2, schoolId: 'TCH002', name: 'Ms. Sarah Johnson', nameKhmer: 'អ្នកគ្រូ សារ៉ា ចនសុន',
    username: 'sarah456', email: 'sarah@school.com', subject: 'English', gender: 'Female',
    dateOfBirth: '1985-11-20', dateJoined: '2014-01-12', phone: '0987654321',
    status: 'active', role: 'teacher', password: 'Welcome@123',
  },
];

const DEFAULT_STUDENTS = [
  {
    id: 1, schoolId: 'STD001', name: 'Ali Ahmed', nameKhmer: 'អាលី អាហ្មែត', username: 'ali123',
    gender: 'Male', studentClass: 'Grade 10', dateOfBirth: '2008-06-12', dateJoined: '2022-09-01',
    phone: '0123456789', password: 'Welcome@123', status: 'active',
  },
  {
    id: 2, schoolId: 'STD002', name: 'Fatima Khan', nameKhmer: 'ហ្វាទីមា ខាន', username: 'fatima456',
    gender: 'Female', studentClass: 'Grade 10', dateOfBirth: '2009-03-22', dateJoined: '2023-01-15',
    phone: '0987654321', password: 'Welcome@123', status: 'active',
  },
];

const DEFAULT_STAFF = [
  {
    id: 1, schoolId: 'STF001', name: 'Staff Member', nameKhmer: 'បុគ្គលិក', username: 'staff',
    email: 'staff@school.com', position: 'Office Administrator', gender: 'Female',
    dateOfBirth: '1990-04-18', dateJoined: '2018-03-01', phone: '0112233445',
    status: 'active', role: 'staff', password: 'Staff123',
  },
];

const DEFAULT_CLASSES = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

const DEFAULT_SCHEDULES = [
  { id: 1, class: 'Grade 10', teacher: 'Mr. John Smith', subject: 'Mathematics', day: 'Monday', time: '09:00-10:00', room: 'Room 101' },
  { id: 2, class: 'Grade 10', teacher: 'Ms. Sarah Johnson', subject: 'English', day: 'Tuesday', time: '10:00-11:00', room: 'Room 102' },
];

const isEmpty = async (table) => {
  const result = await db.query(`SELECT COUNT(*)::int AS count FROM ${table}`);
  return result.rows[0].count === 0;
};

const seedIfEmpty = async (table, key, data) => {
  if (await isEmpty(table)) {
    await storeModel.replaceCollection(key, data);
    logger.info(`Seeded ${data.length} row(s) into ${table}.`);
  } else {
    logger.info(`Skipped ${table} (already has data).`);
  }
};

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
  logger.info(`Seeded ${DEFAULT_USERS.length} admin user(s).`);

  await seedIfEmpty('teachers', 'psis_teacher_accounts', DEFAULT_TEACHERS);
  await seedIfEmpty('staff', 'psis_staff_accounts', DEFAULT_STAFF);
  await seedIfEmpty('students', 'psis_student_accounts', DEFAULT_STUDENTS);
  await seedIfEmpty('classes', 'psis_classes', DEFAULT_CLASSES);
  await seedIfEmpty('schedules', 'psis_schedule_data', DEFAULT_SCHEDULES);
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
