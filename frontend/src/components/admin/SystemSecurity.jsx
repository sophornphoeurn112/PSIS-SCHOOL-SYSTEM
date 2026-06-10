import React, { useState } from "react";
import "./AdminManagement.css";

function SystemSecurity() {
  const [permissions, setPermissions] = useState([
    {
      id: 1,
      role: "Student",
      viewGrades: true,
      viewSchedule: true,
      editProfile: true,
      viewAttendance: true,
    },
    {
      id: 2,
      role: "Teacher",
      viewGrades: true,
      viewSchedule: true,
      enterGrades: true,
      takeAttendance: true,
    },
    {
      id: 3,
      role: "Staff",
      manageRegistration: true,
      processPayments: true,
      editStudentInfo: true,
    },
  ]);

  const handleTogglePermission = (id, permission) => {
    setPermissions(
      permissions.map((p) =>
        p.id === id ? { ...p, [permission]: !p[permission] } : p,
      ),
    );
  };

  return (
    <div className="management-section">
      <h2>System Security & Permissions Management</h2>

      <div className="security-info">
        <div className="info-card">
          <h3>🔒 System Status</h3>
          <p>
            SSL: <strong>Enabled</strong>
          </p>
          <p>
            Two-Factor Auth: <strong>Optional</strong>
          </p>
          <p>
            Login Attempts: <strong>Limited to 5</strong>
          </p>
          <p>
            Session Timeout: <strong>30 minutes</strong>
          </p>
        </div>

        <div className="info-card">
          <h3>📊 Activity Log</h3>
          <p>
            Total Login Attempts: <strong>1,245</strong>
          </p>
          <p>
            Failed Logins: <strong>23</strong>
          </p>
          <p>
            Active Sessions: <strong>8</strong>
          </p>
          <p>
            Last Backup: <strong>Today at 02:00 AM</strong>
          </p>
        </div>
      </div>

      <div className="permissions-container">
        <h3>User Role Permissions</h3>
        <table className="permissions-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>View Grades</th>
              <th>View Schedule</th>
              <th>Edit Profile</th>
              <th>View Attendance</th>
              <th>Enter Grades</th>
              <th>Take Attendance</th>
              <th>Manage Registration</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr key={perm.id}>
                <td>
                  <strong>{perm.role}</strong>
                </td>
                <td>
                  {perm.viewGrades && (
                    <span className="permission-badge active">✓</span>
                  )}
                  {!perm.viewGrades && (
                    <span className="permission-badge">✗</span>
                  )}
                </td>
                <td>
                  {perm.viewSchedule && (
                    <span className="permission-badge active">✓</span>
                  )}
                  {!perm.viewSchedule && (
                    <span className="permission-badge">✗</span>
                  )}
                </td>
                <td>
                  {perm.editProfile && (
                    <span className="permission-badge active">✓</span>
                  )}
                  {!perm.editProfile && (
                    <span className="permission-badge">✗</span>
                  )}
                </td>
                <td>
                  {perm.viewAttendance && (
                    <span className="permission-badge active">✓</span>
                  )}
                  {!perm.viewAttendance && (
                    <span className="permission-badge">✗</span>
                  )}
                </td>
                <td>
                  {perm.enterGrades && (
                    <span className="permission-badge active">✓</span>
                  )}
                  {!perm.enterGrades && (
                    <span className="permission-badge">✗</span>
                  )}
                </td>
                <td>
                  {perm.takeAttendance && (
                    <span className="permission-badge active">✓</span>
                  )}
                  {!perm.takeAttendance && (
                    <span className="permission-badge">✗</span>
                  )}
                </td>
                <td>
                  {perm.manageRegistration && (
                    <span className="permission-badge active">✓</span>
                  )}
                  {!perm.manageRegistration && (
                    <span className="permission-badge">✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SystemSecurity;
