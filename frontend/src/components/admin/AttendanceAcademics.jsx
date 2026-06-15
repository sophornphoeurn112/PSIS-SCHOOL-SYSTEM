import React, { useEffect, useState } from "react";
import {
  getAttendanceRecords,
  getAcademicRecords,
} from "../../services/localStore";
import "./AdminManagement.css";

function AttendanceAcademics() {
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [academicRecords, setAcademicRecords] = useState([]);

  useEffect(() => {
    const rows = getAttendanceRecords().flatMap((record) =>
      record.results.map((item) => ({
        key: `${record.id}-${item.id}`,
        date: record.date,
        teacher: record.teacher,
        className: record.className,
        student: item.name,
        status: item.status,
        reason: item.reason,
      })),
    );
    setAttendanceRows(rows);
    setAcademicRecords(getAcademicRecords());
  }, []);

  return (
    <div className="management-section">
      <h2>Attendance & Academic Records Monitoring</h2>
      <p className="form-note">
        These records are submitted by teachers from their dashboard.
      </p>

      <div className="records-container">
        <div className="records-box">
          <h3>Attendance Records ({attendanceRows.length})</h3>
          <div className="table-container">
            {attendanceRows.length === 0 ? (
              <p className="grade-empty">
                No attendance submitted by teachers yet.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Teacher</th>
                    <th>Class</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRows.map((row) => (
                    <tr key={row.key}>
                      <td>{row.date}</td>
                      <td>{row.teacher || "—"}</td>
                      <td>{row.className}</td>
                      <td>{row.student}</td>
                      <td>
                        <span className={`status ${row.status}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{row.reason || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="records-box">
          <h3>Academic Records ({academicRecords.length})</h3>
          <div className="table-container">
            {academicRecords.length === 0 ? (
              <p className="grade-empty">No scores submitted by teachers yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Teacher</th>
                    <th>Class</th>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Period</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {academicRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.date || "—"}</td>
                      <td>{record.teacher || "—"}</td>
                      <td>{record.className || "—"}</td>
                      <td>{record.student}</td>
                      <td>{record.subject}</td>
                      <td>{record.period || "—"}</td>
                      <td>
                        {record.score}
                        {record.maxScore ? ` / ${record.maxScore}` : ""}
                      </td>
                      <td>
                        <span
                          className={`grade ${
                            record.grade === "A"
                              ? "excellent"
                              : record.grade === "B"
                                ? "good"
                                : "average"
                          }`}
                        >
                          {record.grade}
                        </span>
                      </td>
                      <td>{record.recommendation || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceAcademics;
