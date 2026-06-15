import bcrypt from "bcryptjs";
import {
  getTeacherByCredentials,
  getStaffByCredentials,
} from "./localStore";
import appConfig from "../config/appConfig";
import { supabase, isSupabaseConfigured } from "../config/supabaseClient";

const DEFAULT_USERS = [
  {
    username: "admin",
    password: "Admin123",
    role: "admin",
    name: "Admin",
    email: "admin@school.com",
  },
  {
    username: "teacher",
    password: "Teacher123",
    role: "teacher",
    name: "Mr. John Smith",
    email: "john@school.com",
  },
  {
    username: "student",
    password: "Student123",
    role: "student",
    name: "John Smith",
    email: "student@school.com",
  },
  {
    username: "staff",
    password: "Staff123",
    role: "staff",
    name: "Staff Member",
    email: "staff@school.com",
  },
];

// Account tables checked (in addition to the admin `users` table) when logging
// in against the cloud database. Each derives the session role/extra fields.
const SUPABASE_ACCOUNT_TABLES = [
  { table: "students", role: () => "student", extra: () => ({}) },
  {
    table: "teachers",
    role: (row) => row.role || "teacher",
    extra: (row) => ({ subject: row.subject }),
  },
  {
    table: "staff",
    role: (row) => row.role || "staff",
    extra: (row) => ({ position: row.position }),
  },
];

const makeRejected = () => {
  const error = new Error("Invalid username or password");
  error.handled = true;
  return error;
};

// Verify credentials against the cloud (Supabase) database using bcrypt. A
// thrown error with `handled = true` means "found the account but the password
// was wrong" (stop). A plain thrown error means "not found / unreachable" so the
// caller can fall back to the demo accounts.
const loginViaSupabase = async (username, password) => {
  const admin = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .limit(1);
  if (admin.error) throw new Error("supabase unreachable");
  if (admin.data && admin.data.length) {
    const row = admin.data[0];
    if (bcrypt.compareSync(password, row.password_hash || "")) {
      return {
        token: `sb-token-${Date.now()}`,
        user: {
          username: row.username,
          role: row.role,
          name: row.name,
          email: row.email,
        },
      };
    }
    throw makeRejected();
  }

  for (const account of SUPABASE_ACCOUNT_TABLES) {
    const result = await supabase
      .from(account.table)
      .select("*")
      .eq("username", username)
      .limit(1);
    if (result.error) throw new Error("supabase unreachable");
    if (result.data && result.data.length) {
      const row = result.data[0];
      if (bcrypt.compareSync(password, row.password_hash || "")) {
        return {
          token: `sb-token-${Date.now()}`,
          user: {
            username: row.username,
            role: account.role(row),
            name: row.name,
            email: row.email,
            ...account.extra(row),
          },
        };
      }
      throw makeRejected();
    }
  }

  // Username not found in any table: let the caller try the demo accounts.
  throw new Error("account not found");
};

// Try the backend (database-backed, bcrypt-verified) login first. If the
// backend/database is unreachable, fall back to the local demo accounts so the
// browser-only demo still works.
const loginViaBackend = async (username, password) => {
  const response = await fetch(`${appConfig.apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || "Invalid username or password");
    error.handled = true;
    throw error;
  }
  return body;
};

export const login = async (credentials) => {
  const { username, password } = credentials;

  const loginViaDatabase = isSupabaseConfigured()
    ? loginViaSupabase
    : loginViaBackend;

  try {
    const result = await loginViaDatabase(username, password);
    if (result && result.token && result.user) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      return result;
    }
  } catch (error) {
    // If the database explicitly rejected the credentials, stop here.
    if (error.handled) throw error;
    // Otherwise (account not found / database down) fall through to demo login.
  }

  const localTeacher = getTeacherByCredentials(username, password);

  if (localTeacher) {
    const user = {
      username: localTeacher.username,
      role: localTeacher.role,
      name: localTeacher.name,
      email: localTeacher.email,
      subject: localTeacher.subject,
    };
    const token = `local-token-${Date.now()}`;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  }

  const localStaff = getStaffByCredentials(username, password);

  if (localStaff) {
    const user = {
      username: localStaff.username,
      role: localStaff.role || "staff",
      name: localStaff.name,
      email: localStaff.email,
      position: localStaff.position,
    };
    const token = `local-token-${Date.now()}`;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  }

  const user = DEFAULT_USERS.find(
    (item) => item.username === username && item.password === password,
  );

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const token = `local-token-${Date.now()}`;
  const sessionUser = {
    username: user.username,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(sessionUser));

  return { token, user: sessionUser };
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
