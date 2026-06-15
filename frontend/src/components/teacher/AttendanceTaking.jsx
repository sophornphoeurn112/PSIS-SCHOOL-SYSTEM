import React, { useMemo, useState } from "react";
import {
  getSchedules,
  getStudents,
  getAttendanceRecords,
  addAttendanceRecord,
} from "../../services/localStore";

const STATUS_OPTIONS = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "permission", label: "Ask Permission" },
];

function AttendanceTaking({ teacherName }) {
  const teacherClasses = useMemo(() => {
    const mySchedules = getSchedules().filter(
      (item) => item.teacher === teacherName,
    );
    const seen = new Map();
    mySchedules.forEach((item) => {
      if (!seen.has(item.class)) {
        seen.set(item.class, {
          className: item.class,
          subjects: new Set(),
          days: new Set(),
        });
      }
      const entry = seen.get(item.class);
      if (item.subject) entry.subjects.add(item.subject);
      if (item.day) entry.days.add(item.day);
    });
    return Array.from(seen.values()).map((entry) => ({
      className: entry.className,
      subject: Array.from(entry.subjects).join(", "),
      days: Array.from(entry.days).join(", "),
    }));
  }, [teacherName]);

  const [selectedClass, setSelectedClass] = useState(
    teacherClasses[0]?.className || "",
  );
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [attendance, setAttendance] = useState({});
  const [records, setRecords] = useState(() =>
    getAttendanceRecords().filter((record) => record.teacher === teacherName),
  );

  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return getStudents().filter(
      (student) =>
        student.studentClass === selectedClass && student.status === "active",
    );
  }, [selectedClass]);

  const getStatus = (id) => attendance[id]?.status || "present";
  const getReason = (id) => attendance[id]?.reason || "";

  const handleStatusChange = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: { ...prev[id], status },
    }));
  };

  const handleReasonChange = (id, reason) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: { ...prev[id], reason },
    }));
  };

  const counts = useMemo(() => {
    return classStudents.reduce(
      (acc, student) => {
        const status = getStatus(student.id);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { present: 0, absent: 0, late: 0, permission: 0 },
    );
  }, [classStudents, attendance]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedClass || classStudents.length === 0) return;
    const record = {
      id: Date.now(),
      teacher: teacherName,
      className: selectedClass,
      date,
      results: classStudents.map((student) => ({
        id: student.id,
        name: student.name,
        status: getStatus(student.id),
        reason: getReason(student.id),
      })),
    };
    addAttendanceRecord(record);
    setRecords((prev) => [record, ...prev]);
    alert("Attendance saved and sent to admin!");
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Student Attendance</h2>
        <p>Pick a class from your schedule, then mark each student.</p>
      </div>

      {teacherClasses.length === 0 ? (
        <div className="empty-state">
          You have no classes assigned yet. Ask the admin to add classes to your
          schedule.
        </div>
      ) : (
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Your Classes</label>
            <div className="class-list">
              {teacherClasses.map((item) => (
                <button
                  type="button"
                  key={item.className}
                  className={
                    selectedClass === item.className
                      ? "class-chip active"
                      : "class-chip"
                  }
                  onClick={() => {
                    setSelectedClass(item.className);
                    setAttendance({});
                  }}
                >
                  {item.className}
                  <small>
                    {item.subject}
                    {item.days ? ` · ${item.days}` : ""}
                  </small>
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {classStudents.length === 0 ? (
            <div className="empty-state">
              No students are assigned to {selectedClass || "this class"} yet. An
              admin or staff member needs to create student accounts for this
              class.
            </div>
          ) : (
            <>
              <div className="attendance-list">
                {classStudents.map((student) => (
                  <div key={student.id} className="attendance-row">
                    <span className="student-name">{student.name}</span>
                    <select
                      value={getStatus(student.id)}
                      onChange={(e) =>
                        handleStatusChange(student.id, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Reason (optional)"
                      value={getReason(student.id)}
                      onChange={(e) =>
                        handleReasonChange(student.id, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="submit-btn">
                Save Attendance
              </button>

              <div className="record-summary">
                <p>
                  Total: <strong>{classStudents.length}</strong> · Present:{" "}
                  <strong>{counts.present}</strong> · Absent:{" "}
                  <strong>{counts.absent}</strong> · Late:{" "}
                  <strong>{counts.late}</strong> · Permission:{" "}
                  <strong>{counts.permission}</strong>
                </p>
              </div>
            </>
          )}
        </form>
      )}

      {records.length > 0 && (
        <div className="table-wrapper">
          <h3>Recent Records</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Student</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {records.flatMap((record) =>
                record.results.map((item) => (
                  <tr key={`${record.id}-${item.id}`}>
                    <td>{record.date}</td>
                    <td>{record.className}</td>
                    <td>{item.name}</td>
                    <td>
                      <span className={`badge ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.reason || "—"}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceTaking;
