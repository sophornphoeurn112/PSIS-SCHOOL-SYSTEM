import React, { useEffect, useState } from "react";
import { updateTeacherAccount } from "../../services/localStore";

function ProfileSettings({ user, onSave }) {
  const [profile, setProfile] = useState({
    fullName: user?.name || "",
    username: user?.username || "",
    email: user?.email || "teacher@example.com",
    phone: user?.phone || "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile((current) => ({
      ...current,
      fullName: user?.name || current.fullName,
      username: user?.username || current.username,
    }));
  }, [user]);

  const handleProfileSave = (event) => {
    event.preventDefault();
    const updatedUser = {
      ...user,
      name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMessage("Profile updated successfully.");
    if (onSave) onSave(updatedUser);
  };

  const handlePasswordSave = (event) => {
    event.preventDefault();
    if (!password || password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    const updatedUser = {
      ...user,
      password,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setPassword("");
    setConfirmPassword("");
    setMessage(
      "Password updated locally. Use admin password sync for login persistence.",
    );
    if (onSave) onSave(updatedUser);
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Profile & Password</h2>
        <p>View and update your personal information and password.</p>
      </div>

      {message && <div className="inline-message">{message}</div>}

      <form className="form-grid" onSubmit={handleProfileSave}>
        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) =>
              setProfile({ ...profile, fullName: e.target.value })
            }
          />
        </div>

        <div className="input-group">
          <label>Username</label>
          <input type="text" value={profile.username} disabled />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Phone</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>

        <button type="submit" className="submit-btn">
          Save Profile
        </button>
      </form>

      <form className="form-grid" onSubmit={handlePasswordSave}>
        <div className="input-group">
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ProfileSettings;
