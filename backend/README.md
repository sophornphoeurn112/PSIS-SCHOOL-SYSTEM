# Backend

This folder contains the Express backend and PostgreSQL integration.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure the database connection
   (`DATABASE_URL`).

3. Create a PostgreSQL database and user that match your `DATABASE_URL`, e.g.:

   ```sql
   CREATE ROLE school_user WITH LOGIN PASSWORD 'school_pass';
   CREATE DATABASE school_management OWNER school_user;
   ```

4. Initialise the schema and seed the default accounts:

   ```bash
   npm run db:init
   ```

5. Start the server:

   ```bash
   npm run dev   # or: npm start
   ```

## Default accounts

`db:init` seeds these users (passwords are bcrypt-hashed in the database):

| Username | Password   | Role    |
| -------- | ---------- | ------- |
| admin    | Admin123   | admin   |
| teacher  | Teacher123 | teacher |
| staff    | Staff123   | staff   |
| student  | Student123 | student |

If the database is unreachable, `POST /api/auth/login` falls back to the same
demo accounts so the app stays usable in development.

## API

- `POST /api/auth/login` – authenticate, returns `{ token, user }`.
- `POST /api/auth/register` – create a user `{ username, password, name, email, role }`.
- `GET /api/users` – list users.
- `GET /api/students` / `POST /api/students` / `PUT /api/students/:id` /
  `DELETE /api/students/:id` – manage students.

Protected routes expect an `Authorization: Bearer <token>` header.
