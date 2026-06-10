import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getUser } from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
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

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
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
        {error && <p>{error}</p>}
      </form>
    </main>
  );
}

export default Login;
