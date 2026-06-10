import React, { useEffect, useState } from "react";
import {
  getTeacherAccounts,
  saveTeacherAccounts,
} from "../../services/localStore";
import "./AdminManagement.css";

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    nameKhmer: "",
    schoolId: "",
    username: "",
    subject: "",
    gender: "",
    dateOfBirth: "",
    dateJoined: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    setTeachers(getTeacherAccounts());
  }, []);

  const resetTeacherForm = () => {
    setNewTeacher({
      name: "",
      nameKhmer: "",
      schoolId: "",
      username: "",
      subject: "",
      gender: "",
      dateOfBirth: "",
      dateJoined: "",
      phone: "",
      password: "",
    });
    setEditingTeacherId(null);
    setShowCreateForm(false);
  };

  const handleCreateTeacher = (e) => {
    e.preventDefault();
    const isEditing = Boolean(editingTeacherId);

    if (
      newTeacher.name &&
      newTeacher.nameKhmer &&
      newTeacher.schoolId &&
      newTeacher.username &&
      newTeacher.subject &&
      newTeacher.gender &&
      newTeacher.dateOfBirth &&
      newTeacher.dateJoined &&
      newTeacher.phone &&
      (!isEditing || newTeacher.password)
    ) {
      if (isEditing) {
        const updated = teachers.map((teacher) =>
          teacher.id === editingTeacherId
            ? {
                ...teacher,
                ...newTeacher,
                password: newTeacher.password || teacher.password,
              }
            : teacher,
        );
        setTeachers(updated);
        saveTeacherAccounts(updated);
        alert("Teacher updated successfully!");
      } else {
        const teacher = {
          id: Date.now(),
          ...newTeacher,
          role: "teacher",
          status: "active",
        };
        const updated = [...teachers, teacher];
        setTeachers(updated);
        saveTeacherAccounts(updated);
        alert(
          `Teacher created!\nUsername: ${teacher.username}\nPassword: ${teacher.password}`,
        );
      }
      resetTeacherForm();
    }
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm("Are you sure you want to remove this teacher?")) {
      const updated = teachers.filter((t) => t.id !== id);
      setTeachers(updated);
      saveTeacherAccounts(updated);
    }
  };

  const handleResetPassword = (username) => {
    const updated = teachers.map((teacher) =>
      teacher.username === username
        ? { ...teacher, password: "Welcome@123" }
        : teacher,
    );
    setTeachers(updated);
    saveTeacherAccounts(updated);
    alert(`Password reset for ${username}\nNew Password: Welcome@123`);
  };

  const handleEditTeacher = (teacher) => {
    setShowCreateForm(true);
    setEditingTeacherId(teacher.id);
    setNewTeacher({
      name: teacher.name,
      nameKhmer: teacher.nameKhmer || "",
      schoolId: teacher.schoolId || "",
      username: teacher.username,
      subject: teacher.subject,
      gender: teacher.gender || "",
      dateOfBirth: teacher.dateOfBirth || "",
      dateJoined: teacher.dateJoined || "",
      phone: teacher.phone || "",
      password: "",
    });
  };

  return (
    <div className="management-section">
      <h2>Teacher Account Management</h2>

      <button
        className="btn-primary"
        onClick={() => {
          if (showCreateForm && editingTeacherId) {
            resetTeacherForm();
          } else {
            setShowCreateForm(!showCreateForm);
          }
        }}
      >
        {showCreateForm ? "Cancel" : "+ Create Teacher Account"}
      </button>

      {showCreateForm && (
        <form className="form-container" onSubmit={handleCreateTeacher}>
          <input
            type="text"
            placeholder="Teacher Name (English)"
            value={newTeacher.name}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Teacher Name (Khmer)"
            value={newTeacher.nameKhmer}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, nameKhmer: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Teacher ID"
            value={newTeacher.schoolId}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, schoolId: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={newTeacher.username}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, username: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={newTeacher.subject}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, subject: e.target.value })
            }
            required
          />
          <div className="form-field">
            <label>Gender</label>
            <select
              value={newTeacher.gender}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, gender: e.target.value })
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
              value={newTeacher.dateOfBirth}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, dateOfBirth: e.target.value })
              }
              required
            />
          </div>
          <div className="form-field">
            <label>Date Joined</label>
            <input
              type="date"
              value={newTeacher.dateJoined}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, dateJoined: e.target.value })
              }
              required
            />
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Phone Number"
              value={newTeacher.phone}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, phone: e.target.value })
              }
              required
            />
          </div>
          <input
            type="password"
            placeholder={
              editingTeacherId
                ? "Password (leave blank to keep current)"
                : "Password"
            }
            value={newTeacher.password}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, password: e.target.value })
            }
            required={!editingTeacherId}
          />
          <button type="submit" className="btn-success">
            {editingTeacherId ? "Save Changes" : "Create Account"}
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
              <th>Subject</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Joined</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.schoolId || "—"}</td>
                <td>{teacher.name}</td>
                <td>{teacher.nameKhmer || "—"}</td>
                <td>{teacher.username}</td>
                <td>{teacher.subject}</td>
                <td>{teacher.gender || "—"}</td>
                <td>{teacher.dateOfBirth || "—"}</td>
                <td>{teacher.dateJoined || "—"}</td>
                <td>{teacher.phone || "—"}</td>
                <td>
                  <span className={`status ${teacher.status}`}>
                    {teacher.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-sm btn-primary"
                    onClick={() => handleEditTeacher(teacher)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-sm btn-warning"
                    onClick={() => handleResetPassword(teacher.username)}
                  >
                    Reset Password
                  </button>
                  <button
                    className="btn-sm btn-danger"
                    onClick={() => handleDeleteTeacher(teacher.id)}
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

export default TeacherManagement;
