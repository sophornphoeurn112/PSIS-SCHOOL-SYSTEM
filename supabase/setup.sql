-- ============================================================================
-- PSIS School System — Supabase setup
-- Paste this whole file into: Supabase -> SQL Editor -> New query -> Run
-- Safe to run more than once (uses IF NOT EXISTS / ON CONFLICT DO NOTHING).
-- It creates all tables, opens them to the app, and seeds the demo accounts
-- with bcrypt-hashed passwords.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists users (
  id            bigserial primary key,
  username      varchar(100) unique not null,
  password_hash varchar(255) not null,
  role          varchar(50)  not null default 'student',
  name          varchar(255) not null,
  email         varchar(255),
  created_at    timestamptz  not null default now()
);

create table if not exists students (
  id            bigint primary key,
  school_id     varchar(50),
  name          varchar(255) not null,
  name_khmer    varchar(255),
  username      varchar(100) unique not null,
  gender        varchar(20),
  student_class varchar(100),
  date_of_birth varchar(50),
  date_joined   varchar(50),
  phone         varchar(50),
  password_hash varchar(255),
  status        varchar(20) not null default 'active'
);

create table if not exists teachers (
  id            bigint primary key,
  school_id     varchar(50),
  name          varchar(255) not null,
  name_khmer    varchar(255),
  username      varchar(100) unique not null,
  email         varchar(255),
  subject       varchar(255),
  gender        varchar(20),
  date_of_birth varchar(50),
  date_joined   varchar(50),
  phone         varchar(50),
  status        varchar(20) not null default 'active',
  role          varchar(50) not null default 'teacher',
  password_hash varchar(255)
);

create table if not exists staff (
  id            bigint primary key,
  school_id     varchar(50),
  name          varchar(255) not null,
  name_khmer    varchar(255),
  username      varchar(100) unique not null,
  email         varchar(255),
  position      varchar(255),
  gender        varchar(20),
  date_of_birth varchar(50),
  date_joined   varchar(50),
  phone         varchar(50),
  status        varchar(20) not null default 'active',
  role          varchar(50) not null default 'staff',
  password_hash varchar(255)
);

create table if not exists classes (
  name varchar(100) primary key
);

create table if not exists schedules (
  id         bigint primary key,
  class_name varchar(100),
  teacher    varchar(255),
  subject    varchar(255),
  day        varchar(50),
  time_slot  varchar(100),
  room       varchar(100)
);

create table if not exists attendance_records (
  id         bigint primary key,
  teacher    varchar(255),
  class_name varchar(100),
  date_text  varchar(50),
  results    jsonb
);

create table if not exists academic_records (
  id             varchar(100) primary key,
  teacher        varchar(255),
  class_name     varchar(100),
  subject        varchar(255),
  period         varchar(100),
  student        varchar(255),
  score          numeric,
  max_score      numeric,
  grade          varchar(10),
  recommendation text,
  date_text      varchar(50)
);

-- ---------------------------------------------------------------------------
-- Row Level Security: allow the app (anon/authenticated keys) to read & write.
-- This is a school demo app without per-user auth, so access is open.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'users','students','teachers','staff','classes',
    'schedules','attendance_records','academic_records'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "app access" on %I;', t);
    execute format(
      'create policy "app access" on %I for all to anon, authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Seed demo accounts (passwords are bcrypt-hashed via pgcrypto).
-- ---------------------------------------------------------------------------
insert into users (username, password_hash, role, name, email) values
  ('admin', crypt('Admin123', gen_salt('bf', 10)), 'admin', 'Admin', 'admin@school.com')
on conflict (username) do nothing;

insert into teachers (id, school_id, name, name_khmer, username, email, subject, gender, date_of_birth, date_joined, phone, status, role, password_hash) values
  (1, 'TCH001', 'Mr. John Smith', 'លោក ជន ស្មីត', 'john123', 'john@school.com', 'Mathematics', 'Male', '1980-05-10', '2010-08-15', '0123456789', 'active', 'teacher', crypt('Welcome@123', gen_salt('bf', 10))),
  (2, 'TCH002', 'Ms. Sarah Johnson', 'អ្នកគ្រូ សារ៉ា ចនសុន', 'sarah456', 'sarah@school.com', 'English', 'Female', '1985-11-20', '2014-01-12', '0987654321', 'active', 'teacher', crypt('Welcome@123', gen_salt('bf', 10)))
on conflict (id) do nothing;

insert into staff (id, school_id, name, name_khmer, username, email, position, gender, date_of_birth, date_joined, phone, status, role, password_hash) values
  (1, 'STF001', 'Staff Member', 'បុគ្គលិក', 'staff', 'staff@school.com', 'Office Administrator', 'Female', '1990-04-18', '2018-03-01', '0112233445', 'active', 'staff', crypt('Staff123', gen_salt('bf', 10)))
on conflict (id) do nothing;

insert into students (id, school_id, name, name_khmer, username, gender, student_class, date_of_birth, date_joined, phone, password_hash, status) values
  (1, 'STD001', 'Ali Ahmed', 'អាលី អាហ្មែត', 'ali123', 'Male', 'Grade 10', '2008-06-12', '2022-09-01', '0123456789', crypt('Welcome@123', gen_salt('bf', 10)), 'active'),
  (2, 'STD002', 'Fatima Khan', 'ហ្វាទីមា ខាន', 'fatima456', 'Female', 'Grade 10', '2009-03-22', '2023-01-15', '0987654321', crypt('Welcome@123', gen_salt('bf', 10)), 'active')
on conflict (id) do nothing;

insert into classes (name)
select 'Grade ' || g from generate_series(1, 12) as g
on conflict (name) do nothing;

insert into schedules (id, class_name, teacher, subject, day, time_slot, room) values
  (1, 'Grade 10', 'Mr. John Smith', 'Mathematics', 'Monday', '09:00-10:00', 'Room 101'),
  (2, 'Grade 10', 'Ms. Sarah Johnson', 'English', 'Tuesday', '10:00-11:00', 'Room 102')
on conflict (id) do nothing;

-- Done. You should see the tables under: Table Editor (left sidebar).
