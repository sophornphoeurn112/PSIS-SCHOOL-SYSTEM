import React, { useEffect, useState } from "react";
import {
  getStaffAccounts,
  saveStaffAccounts,
} from "../../services/localStore";
import "./AdminManagement.css";

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [newStaff, setNewStaff] = useState({
    name: "",
    nameKhmer: "",
    schoolId: "",
    username: "",
    position: "",
    gender: "",
    dateOfBirth: "",
    dateJoined: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    setStaff(getStaffAccounts());
  }, []);

  const resetStaffForm = () => {
    setNewStaff({
      name: "",
      nameKhmer: "",
      schoolId: "",
      username: "",
      position: "",
      gender: "",
      dateOfBirth: "",
      dateJoined: "",
      phone: "",
      password: "",
    });
    setEditingStaffId(null);
    setShowCreateForm(false);
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    const isEditing = Boolean(editingStaffId);

    if (
      newStaff.name &&
      newStaff.nameKhmer &&
      newStaff.schoolId &&
      newStaff.username &&
      newStaff.position &&
      newStaff.gender &&
      newStaff.dateOfBirth &&
      newStaff.dateJoined &&
      newStaff.phone &&
      (!isEditing || newStaff.password)
    ) {
      if (isEditing) {
        const updated = staff.map((member) =>
          member.id === editingStaffId
            ? {
                ...member,
                ...newStaff,
                password: newStaff.password || member.password,
              }
            : member,
        );
        setStaff(updated);
        saveStaffAccounts(updated);
        alert("Staff updated successfully!");
      } else {
        const member = {
          id: Date.now(),
          ...newStaff,
          role: "staff",
          status: "active",
        };
        const updated = [...staff, member];
        setStaff(updated);
        saveStaffAccounts(updated);
        alert(
          `Staff created!\nUsername: ${member.username}\nPassword: ${member.password}`,
        );
      }
      resetStaffForm();
    }
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      const updated = staff.filter((member) => member.id !== id);
      setStaff(updated);
      saveStaffAccounts(updated);
    }
  };

  const handleResetPassword = (username) => {
    const updated = staff.map((member) =>
      member.username === username
        ? { ...member, password: "Welcome@123" }
        : member,
    );
    setStaff(updated);
    saveStaffAccounts(updated);
    alert(`Password reset for ${username}\nNew Password: Welcome@123`);
  };

  const handleChangePassword = (username) => {
    const newPassword = window.prompt(`Enter a new password for ${username}:`);
    if (newPassword === null) return;
    if (newPassword.trim().length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    const updated = staff.map((member) =>
      member.username === username
        ? { ...member, password: newPassword }
        : member,
    );
    setStaff(updated);
    saveStaffAccounts(updated);
    alert(`Password updated for ${username}\nNew Password: ${newPassword}`);
  };

  const handleEditStaff = (member) => {
    setShowCreateForm(true);
    setEditingStaffId(member.id);
    setNewStaff({
      name: member.name,
      nameKhmer: member.nameKhmer || "",
      schoolId: member.schoolId || "",
      username: member.username,
      position: member.position || "",
      gender: member.gender || "",
      dateOfBirth: member.dateOfBirth || "",
      dateJoined: member.dateJoined || "",
      phone: member.phone || "",
      password: "",
    });
  };

  return (
    <div className="management-section">
      <h2>Staff Account Management</h2>

      <button
        className="btn-primary"
        onClick={() => {
          if (showCreateForm && editingStaffId) {
            resetStaffForm();
          } else {
            setShowCreateForm(!showCreateForm);
          }
        }}
      >
        {showCreateForm ? "Cancel" : "+ Create Staff Account"}
      </button>

      {showCreateForm && (
        <form className="form-container" onSubmit={handleCreateStaff}>
          <input
            type="text"
            placeholder="Staff Name (English)"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Staff Name (Khmer)"
            value={newStaff.nameKhmer}
            onChange={(e) =>
              setNewStaff({ ...newStaff, nameKhmer: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Staff ID"
            value={newStaff.schoolId}
            onChange={(e) =>
              setNewStaff({ ...newStaff, schoolId: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={newStaff.username}
            onChange={(e) =>
              setNewStaff({ ...newStaff, username: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Position (e.g. Office Administrator)"
            value={newStaff.position}
            onChange={(e) =>
              setNewStaff({ ...newStaff, position: e.target.value })
            }
            required
          />
          <div className="form-field">
            <label>Gender</label>
            <select
              value={newStaff.gender}
              onChange={(e) =>
                setNewStaff({ ...newStaff, gender: e.target.value })
              }
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label>Date of Birth</label>
            <input
              type="date"
              value={newStaff.dateOfBirth}
              onChange={(e) =>
                setNewStaff({ ...newStaff, dateOfBirth: e.target.value })
              }
              required
            />
          </div>
          <div className="form-field">
            <label>Date Joined</label>
            <input
              type="date"
              value={newStaff.dateJoined}
              onChange={(e) =>
                setNewStaff({ ...newStaff, dateJoined: e.target.value })
              }
              required
            />
          </div>
          <input
            type="text"
            placeholder="Phone Number"
            value={newStaff.phone}
            onChange={(e) =>
              setNewStaff({ ...newStaff, phone: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder={
              editingStaffId ? "New Password" : "Temporary Password"
            }
            value={newStaff.password}
            onChange={(e) =>
              setNewStaff({ ...newStaff, password: e.target.value })
            }
            required={!editingStaffId}
          />
          <button type="submit" className="btn-success">
            {editingStaffId ? "Update Staff" : "Create Account"}
          </button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name (English)</th>
              <th>Name (Khmer)</th>
              <th>Username</th>
              <th>Position</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Joined</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id}>
                <td>{member.schoolId || "—"}</td>
                <td>{member.name}</td>
                <td>{member.nameKhmer || "—"}</td>
                <td>{member.username}</td>
                <td>{member.position || "—"}</td>
                <td>{member.gender || "—"}</td>
                <td>{member.dateOfBirth || "—"}</td>
                <td>{member.dateJoined || "—"}</td>
                <td>{member.phone || "—"}</td>
                <td>
                  <span className={`status ${member.status}`}>
                    {member.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-sm btn-primary"
                    onClick={() => handleEditStaff(member)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-sm btn-success"
                    onClick={() => handleChangePassword(member.username)}
                  >
                    Change Password
                  </button>
                  <button
                    className="btn-sm btn-warning"
                    onClick={() => handleResetPassword(member.username)}
                  >
                    Reset Password
                  </button>
                  <button
                    className="btn-sm btn-danger"
                    onClick={() => handleDeleteStaff(member.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffManagement;
