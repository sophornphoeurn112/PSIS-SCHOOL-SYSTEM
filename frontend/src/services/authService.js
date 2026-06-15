import {
  getTeacherByCredentials,
  getStaffByCredentials,
} from "./localStore";
import appConfig from "../config/appConfig";

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

  try {
    const result = await loginViaBackend(username, password);
    if (result && result.token && result.user) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      return result;
    }
  } catch (error) {
    // If the backend explicitly rejected the credentials, stop here.
    if (error.handled) throw error;
    // Otherwise (network/database down) fall through to local demo login.
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
