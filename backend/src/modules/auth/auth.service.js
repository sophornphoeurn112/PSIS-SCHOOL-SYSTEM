// Demo credentials for development/testing
const DEMO_USERS = {
  admin: { password: "Admin123", role: "admin", name: "Admin" },
  teacher: { password: "Teacher123", role: "teacher", name: "Mr. John" },
  staff: { password: "Staff123", role: "staff", name: "Staff Member" },
  student: { password: "Student123", role: "student", name: "John Smith" },
};

exports.login = async (credentials) => {
  const { username, password } = credentials;

  const user = DEMO_USERS[username];

  if (!user || user.password !== password) {
    const error = new Error("Invalid username or password");
    error.status = 401;
    throw error;
  }

  return {
    token: "demo-jwt-token-" + Date.now(),
    user: {
      username,
      role: user.role,
      name: user.name,
    },
  };
};

exports.register = async (data) => {
  // TODO: Implement registration and user creation
  return { id: "user-id", email: data.email };
};
