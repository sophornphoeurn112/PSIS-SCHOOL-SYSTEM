const userModel = require('../users/user.model');
const { hashPassword, comparePassword } = require('../../utils/password');
const logger = require('../../utils/logger');

// Fallback demo credentials used when the database is unavailable or empty,
// so the app remains usable for development/testing without a running database.
const DEMO_USERS = {
  admin: { password: 'Admin123', role: 'admin', name: 'Admin' },
  teacher: { password: 'Teacher123', role: 'teacher', name: 'Mr. John' },
  staff: { password: 'Staff123', role: 'staff', name: 'Staff Member' },
  student: { password: 'Student123', role: 'student', name: 'John Smith' },
};

const buildToken = () => `token-${Date.now()}`;

const loginWithDemoUser = (username, password) => {
  const demo = DEMO_USERS[username];
  if (!demo || demo.password !== password) {
    const error = new Error('Invalid username or password');
    error.status = 401;
    throw error;
  }
  return {
    token: buildToken(),
    user: { username, role: demo.role, name: demo.name },
  };
};

exports.login = async (credentials) => {
  const { username, password } = credentials || {};

  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.status = 400;
    throw error;
  }

  let dbUser;
  try {
    dbUser = await userModel.findByUsername(username);
  } catch (error) {
    // Database not reachable – fall back to demo users.
    logger.warn(`Auth DB lookup failed, using demo users: ${error.message}`);
    return loginWithDemoUser(username, password);
  }

  if (!dbUser) {
    return loginWithDemoUser(username, password);
  }

  const passwordMatches = await comparePassword(password, dbUser.password_hash);
  if (!passwordMatches) {
    const error = new Error('Invalid username or password');
    error.status = 401;
    throw error;
  }

  return {
    token: buildToken(),
    user: {
      username: dbUser.username,
      role: dbUser.role,
      name: dbUser.name,
      email: dbUser.email,
    },
  };
};

exports.register = async (data) => {
  const { username, password, name, email, role } = data || {};

  if (!username || !password || !name) {
    const error = new Error('username, password and name are required');
    error.status = 400;
    throw error;
  }

  const existing = await userModel.findByUsername(username);
  if (existing) {
    const error = new Error('Username already exists');
    error.status = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const created = await userModel.create({
    username,
    passwordHash,
    name,
    email,
    role: role || 'student',
  });

  return {
    id: created.id,
    username: created.username,
    role: created.role,
    name: created.name,
    email: created.email,
  };
};
