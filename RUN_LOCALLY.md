# Run PSIS School System on your own computer (with PostgreSQL)

This guide makes the app save all data into your **local PostgreSQL** (the one you set up
in pgAdmin with password `12345`). Once running, everything you create — students, teachers,
staff, classes, schedules, attendance, scores — is stored in the database, so it survives
closing the browser, restarting the computer, and even clearing Chrome.

> You need two things installed first: **Node.js** (https://nodejs.org, the "LTS" version)
> and **PostgreSQL** (you already have this with pgAdmin).

---

## Step 1 — Get the code

Either clone it:

```bash
git clone https://github.com/sophornphoeurn112/PSIS-SCHOOL-SYSTEM.git
cd PSIS-SCHOOL-SYSTEM
```

…or download the ZIP from GitHub (green **Code** button → **Download ZIP**) and unzip it.

---

## Step 2 — Create the database

Open **pgAdmin** (or the `psql` shell) and create one empty database named `psis_school`:

```sql
CREATE DATABASE psis_school;
```

(That's it — the app creates all the tables for you in Step 4.)

---

## Step 3 — Configure the backend

In the `backend` folder, create a file named `.env` with this content:

```
PORT=5000
DATABASE_URL=postgresql://postgres:12345@localhost:5432/psis_school
JWT_SECRET=dev_secret_change_me
NODE_ENV=development
```

- `postgres` is the default PostgreSQL username — change it if yours is different.
- `12345` is your database password — change it if yours is different.
- `psis_school` is the database you created in Step 2.

Then install the backend and create + seed the tables:

```bash
cd backend
npm install
npm run db:init     # creates all tables and adds the demo accounts
npm start           # starts the backend on http://localhost:5000
```

Leave this terminal running.

After `npm run db:init`, open pgAdmin and you will see the new tables under
`psis_school → Schemas → public → Tables`: `users`, `students`, `teachers`, `staff`,
`classes`, `schedules`, `attendance_records`, `academic_records`.

---

## Step 4 — Start the frontend

Open a **second** terminal:

```bash
cd frontend
npm install
npm start           # opens http://localhost:3000 in your browser
```

The frontend already points at `http://localhost:5000/api` by default, so no extra config
is needed. (If you ever host the backend elsewhere, create `frontend/.env` with
`REACT_APP_API_URL=http://your-host:5000/api`.)

---

## Step 5 — Log in and test

Open **http://localhost:3000** and log in with any demo account:

| Role    | Username   | Password      |
|---------|------------|---------------|
| Admin   | `admin`    | `Admin123`    |
| Teacher | `john123`  | `Welcome@123` |
| Staff   | `staff`    | `Staff123`    |
| Student | `ali123`   | `Welcome@123` |

Try it: log in as **admin**, create a new student, then **close the browser and reopen it**
(or even restart the computer). Log back in — the student is still there, because it is saved
in your PostgreSQL database, not in the browser.

---

## How passwords are stored

Passwords are never stored as plain text. They are hashed with **bcrypt** before being saved
(the database column is `password_hash`). This is the Node.js equivalent of Laravel's
`Hash::make()`. Login compares the typed password against the stored hash.

## If the database is not running

The app still opens and works using temporary browser storage as a fallback (handy for the
public demo link). To get real, permanent storage, make sure the backend (Step 3) is running
and connected to PostgreSQL.
