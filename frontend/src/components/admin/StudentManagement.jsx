import React, { useState } from "react";
import {
  getStudents,
  saveStudents,
  GRADE_OPTIONS,
} from "../../services/localStore";
import "./AdminManagement.css";

function StudentManagement() {
  const [students, setStudents] = useState(() => getStudents());

  // Persist to localStorage so created/edited students survive a page refresh.
  const persistStudents = (next) => {
    setStudents(next);
    saveStudents(next);
  };
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState("All");

  const countByGrade = (grade) =>
    students.filter((student) => student.studentClass === grade).length;

  const visibleStudents =
    selectedGrade === "All"
      ? students
      : students.filter((student) => student.studentClass === selectedGrade);
  const [newStudent, setNewStudent] = useState({
    schoolId: "",
    name: "",
    nameKhmer: "",
    username: "",
    gender: "",
    studentClass: "",
    dateOfBirth: "",
    dateJoined: "",
    phone: "",
    password: "",
  });

  const resetStudentForm = () => {
    setNewStudent({
      schoolId: "",
      name: "",
      nameKhmer: "",
      username: "",
      gender: "",
      studentClass: "",
      dateOfBirth: "",
      dateJoined: "",
      phone: "",
      password: "",
    });
    setEditingStudentId(null);
    setShowCreateForm(false);
  };

  const handleCreateStudent = (e) => {
    e.preventDefault();
    const isEditing = Boolean(editingStudentId);

    if (
      newStudent.schoolId &&
      newStudent.name &&
      newStudent.nameKhmer &&
      newStudent.username &&
      newStudent.gender &&
      newStudent.studentClass &&
      newStudent.dateOfBirth &&
      newStudent.dateJoined &&
      newStudent.phone &&
      (!isEditing || newStudent.password)
    ) {
      if (isEditing) {
        const updated = students.map((student) =>
          student.id === editingStudentId
            ? {
                ...student,
                ...newStudent,
                password: newStudent.password || student.password,
              }
            : student,
        );
        persistStudents(updated);
        alert("Student information updated successfully!");
      } else {
        const nextId =
          students.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1;
        const student = {
          id: nextId,
          ...newStudent,
          password: newStudent.password,
          status: "active",
        };
        persistStudents([...students, student]);
        alert(
          `Student created!\nUsername: ${student.username}\nTemporary Password: ${student.password}`,
        );
      }
      setSelectedGrade(newStudent.studentClass || "All");
      resetStudentForm();
    }
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to suspend this student?")) {
      persistStudents(
        students.map((s) => (s.id === id ? { ...s, status: "suspended" } : s)),
      );
    }
  };

  const handleResetPassword = (id) => {
    const updated = students.map((student) =>
      student.id === id ? { ...student, password: "Welcome@123" } : student,
    );
    persistStudents(updated);
    const student = updated.find((s) => s.id === id);
    alert(`Password reset for ${student.username}\nNew Password: Welcome@123`);
  };

  const handleChangePassword = (id) => {
    const target = students.find((s) => s.id === id);
    const newPassword = window.prompt(
      `Enter a new password for ${target?.username || "this student"}:`,
    );
    if (newPassword === null) return;
    if (newPassword.trim().length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    const updated = students.map((student) =>
      student.id === id ? { ...student, password: newPassword } : student,
    );
    persistStudents(updated);
    alert(`Password updated for ${target?.username}\nNew Password: ${newPassword}`);
  };

  const handleEditStudent = (student) => {
    setShowCreateForm(true);
    setEditingStudentId(student.id);
    setNewStudent({
      schoolId: student.schoolId || "",
      name: student.name,
      nameKhmer: student.nameKhmer || "",
      username: student.username,
      gender: student.gender || "",
      studentClass: student.studentClass || "",
      dateOfBirth: student.dateOfBirth || "",
      dateJoined: student.dateJoined || "",
      phone: student.phone || "",
      password: "",
    });
  };

  return (
    <div className="management-section">
      <h2>Student Account Management</h2>

      <button
        className="btn-primary"
        onClick={() => {
          if (showCreateForm && editingStudentId) {
            resetStudentForm();
          } else {
            setShowCreateForm(!showCreateForm);
          }
        }}
      >
        {showCreateForm ? "Cancel" : "+ Create Student Account"}
      </button>

      {showCreateForm && (
        <form className="form-container" onSubmit={handleCreateStudent}>
          <input
            type="text"
            placeholder="Student ID"
            value={newStudent.schoolId}
            onChange={(e) =>
              setNewStudent({ ...newStudent, schoolId: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Student Name (English)"
            value={newStudent.name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Student Name (Khmer)"
            value={newStudent.nameKhmer}
            onChange={(e) =>
              setNewStudent({ ...newStudent, nameKhmer: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={newStudent.username}
            onChange={(e) =>
              setNewStudent({ ...newStudent, username: e.target.value })
            }
            required
          />
          <div className="form-field">
            <label>Gender</label>
            <select
              value={newStudent.gender}
              onChange={(e) =>
                setNewStudent({ ...newStudent, gender: e.target.value })
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
            <label>Class</label>
            <select
              value={newStudent.studentClass}
              onChange={(e) =>
                setNewStudent({ ...newStudent, studentClass: e.target.value })
              }
              required
            >
              <option value="">Select Class</option>
              {GRADE_OPTIONS.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Date of Birth</label>
            <input
              type="date"
              value={newStudent.dateOfBirth}
              onChange={(e) =>
                setNewStudent({ ...newStudent, dateOfBirth: e.target.value })
              }
              required
            />
          </div>
          <div className="form-field">
            <label>Date Joined</label>
            <input
              type="date"
              value={newStudent.dateJoined}
              onChange={(e) =>
                setNewStudent({ ...newStudent, dateJoined: e.target.value })
              }
              required
            />
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Phone Number"
              value={newStudent.phone}
              onChange={(e) =>
                setNewStudent({ ...newStudent, phone: e.target.value })
              }
              required
            />
          </div>
          <input
            type="password"
            placeholder={
              editingStudentId
                ? "Password (leave blank to keep current)"
                : "Password"
            }
            value={newStudent.password}
            onChange={(e) =>
              setNewStudent({ ...newStudent, password: e.target.value })
            }
            required={!editingStudentId}
          />
          <button type="submit" className="btn-success">
            {editingStudentId ? "Save Changes" : "Create Account"}
          </button>
        </form>
      )}

      <div className="grade-filter">
        <button
          type="button"
          className={`grade-box ${selectedGrade === "All" ? "active" : ""}`}
          onClick={() => setSelectedGrade("All")}
        >
          <span className="grade-box-label">All Grades</span>
          <span className="grade-box-count">{students.length}</span>
        </button>
        {GRADE_OPTIONS.map((grade) => (
          <button
            type="button"
            key={grade}
            className={`grade-box ${selectedGrade === grade ? "active" : ""}`}
            onClick={() => setSelectedGrade(grade)}
          >
            <span className="grade-box-label">{grade}</span>
            <span className="grade-box-count">{countByGrade(grade)}</span>
          </button>
        ))}
      </div>

      <h3 className="grade-heading">
        {selectedGrade === "All" ? "All Students" : `${selectedGrade} Students`}{" "}
        ({visibleStudents.length})
      </h3>

      <div className="table-container">
        {visibleStudents.length === 0 ? (
          <p className="grade-empty">
            No students in {selectedGrade === "All" ? "the system" : selectedGrade}{" "}
            yet. Use “+ Create Student Account” to add one.
          </p>
        ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name (English)</th>
              <th>Name (Khmer)</th>
              <th>Username</th>
              <th>Gender</th>
              <th>Class</th>
              <th>DOB</th>
              <th>Joined</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.schoolId || "—"}</td>
                <td>{student.name}</td>
                <td>{student.nameKhmer || "—"}</td>
                <td>{student.username}</td>
                <td>{student.gender || "—"}</td>
                <td>{student.studentClass || "—"}</td>
                <td>{student.dateOfBirth || "—"}</td>
                <td>{student.dateJoined || "—"}</td>
                <td>{student.phone || "—"}</td>
                <td>
                  <span className={`status ${student.status}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-sm btn-primary"
                    onClick={() => handleEditStudent(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-sm btn-success"
                    onClick={() => handleChangePassword(student.id)}
                  >
                    Change Password
                  </button>
                  <button
                    className="btn-sm btn-warning"
                    onClick={() => handleResetPassword(student.id)}
                  >
                    Reset Password
                  </button>
                  <button
                    className="btn-sm btn-danger"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

export default StudentManagement;
