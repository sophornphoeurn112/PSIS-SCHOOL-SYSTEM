import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getUser } from "../../services/authService";
import "./Login.css";

const DEMO_ACCOUNTS = [
  { label: "Admin", username: "admin", password: "Admin123" },
  { label: "Teacher", username: "teacher", password: "Teacher123" },
  { label: "Staff", username: "staff", password: "Staff123" },
  { label: "Student", username: "student", password: "Student123" },
];

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await login({ username, password });

      // Get user info to determine role-based redirect
      const user = getUser();
      const roleRoutes = {
        admin: "/admin",
        teacher: "/teacher",
        student: "/student",
        staff: "/staff",
      };

      const route = roleRoutes[user.role] || "/";
      navigate(route);
    } catch (err) {
      setError(err.message);
    }
  };

  const fillDemo = (account) => {
    setUsername(account.username);
    setPassword(account.password);
    setError(null);
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">PSIS</div>
          <div>
            <h1>PSIS School System</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Sign In</button>
          {error && <p className="login-error">{error}</p>}
        </form>

        <div className="demo-box">
          <span className="demo-title">Demo accounts (click to fill)</span>
          <div className="demo-buttons">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.username}
                type="button"
                className="demo-chip"
                onClick={() => fillDemo(account)}
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
