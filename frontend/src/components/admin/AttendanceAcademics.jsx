import React, { useState } from "react";
import "./AdminManagement.css";

function AttendanceAcademics() {
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      student: "Ali Ahmed",
      class: "10A",
      present: 45,
      absent: 5,
      percentage: "90%",
    },
    {
      id: 2,
      student: "Fatima Khan",
      class: "10A",
      present: 48,
      absent: 2,
      percentage: "96%",
    },
    {
      id: 3,
      student: "Hassan Ali",
      class: "10B",
      present: 40,
      absent: 10,
      percentage: "80%",
    },
  ]);

  const [academicRecords, setAcademicRecords] = useState([
    {
      id: 1,
      student: "Ali Ahmed",
      subject: "Mathematics",
      marks: 85,
      grade: "A",
      status: "Excellent",
    },
    {
      id: 2,
      student: "Fatima Khan",
      subject: "English",
      marks: 92,
      grade: "A+",
      status: "Outstanding",
    },
    {
      id: 3,
      student: "Hassan Ali",
      subject: "Mathematics",
      marks: 72,
      grade: "B",
      status: "Good",
    },
  ]);

  return (
    <div className="management-section">
      <h2>Attendance & Academic Records Monitoring</h2>

      <div className="records-container">
        <div className="records-box">
          <h3>Attendance Records</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Present Days</th>
                  <th>Absent Days</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.student}</td>
                    <td>{record.class}</td>
                    <td>{record.present}</td>
                    <td>{record.absent}</td>
                    <td>
                      <span
                        className={`percentage ${record.percentage === "90%" || record.percentage === "96%" ? "high" : "medium"}`}
                      >
                        {record.percentage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="records-box">
          <h3>Academic Records</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {academicRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.student}</td>
                    <td>{record.subject}</td>
                    <td>{record.marks}</td>
                    <td>
                      <span
                        className={`grade ${record.grade === "A+" ? "excellent" : record.grade === "A" ? "good" : "average"}`}
                      >
                        {record.grade}
                      </span>
                    </td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceAcademics;
