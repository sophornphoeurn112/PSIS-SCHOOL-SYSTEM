-- Database schema for the School Management System (PostgreSQL)
-- Run with: npm run db:init

-- Base auth table (admin and a row mirrored for every account).
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'student',
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id BIGINT PRIMARY KEY,
  school_id VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  name_khmer VARCHAR(255),
  username VARCHAR(100) UNIQUE NOT NULL,
  gender VARCHAR(20),
  student_class VARCHAR(100),
  date_of_birth VARCHAR(50),
  date_joined VARCHAR(50),
  phone VARCHAR(50),
  password_hash VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS teachers (
  id BIGINT PRIMARY KEY,
  school_id VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  name_khmer VARCHAR(255),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  subject VARCHAR(255),
  gender VARCHAR(20),
  date_of_birth VARCHAR(50),
  date_joined VARCHAR(50),
  phone VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  role VARCHAR(50) NOT NULL DEFAULT 'teacher',
  password_hash VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS staff (
  id BIGINT PRIMARY KEY,
  school_id VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  name_khmer VARCHAR(255),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  position VARCHAR(255),
  gender VARCHAR(20),
  date_of_birth VARCHAR(50),
  date_joined VARCHAR(50),
  phone VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  role VARCHAR(50) NOT NULL DEFAULT 'staff',
  password_hash VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS classes (
  name VARCHAR(100) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS schedules (
  id BIGINT PRIMARY KEY,
  class_name VARCHAR(100),
  teacher VARCHAR(255),
  subject VARCHAR(255),
  day VARCHAR(50),
  time_slot VARCHAR(100),
  room VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id BIGINT PRIMARY KEY,
  teacher VARCHAR(255),
  class_name VARCHAR(100),
  date_text VARCHAR(50),
  results JSONB
);

CREATE TABLE IF NOT EXISTS academic_records (
  id VARCHAR(100) PRIMARY KEY,
  teacher VARCHAR(255),
  class_name VARCHAR(100),
  subject VARCHAR(255),
  period VARCHAR(100),
  student VARCHAR(255),
  score NUMERIC,
  max_score NUMERIC,
  grade VARCHAR(10),
  recommendation TEXT,
  date_text VARCHAR(50)
);
