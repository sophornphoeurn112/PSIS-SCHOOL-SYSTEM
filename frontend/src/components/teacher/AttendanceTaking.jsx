import React, { useMemo, useState } from "react";

const students = [
  { id: 1, name: "Aisha Benson" },
  { id: 2, name: "David Kim" },
  { id: 3, name: "Mina Patel" },
  { id: 4, name: "Isaac Chen" },
  { id: 5, name: "Rita Gomez" },
];

const classOptions = ["Grade 9A", "Grade 10B", "Grade 11C"];

function AttendanceTaking() {
  const [selectedClass, setSelectedClass] = useState(classOptions[0]);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [attendance, setAttendance] = useState(() => {
    return students.reduce((map, student) => {
      map[student.id] = "present";
      return map;
    }, {});
  });
  const [records, setRecords] = useState([]);

  const presentCount = useMemo(
    () =>
      Object.values(attendance).filter((status) => status === "present").length,
    [attendance],
  );

  const handleStatusChange = (id, status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const record = {
      id: Date.now(),
      className: selectedClass,
      date,
      results: students.map((student) => ({
        id: student.id,
        name: student.name,
        status: attendance[student.id],
      })),
    };
    setRecords((prev) => [record, ...prev]);
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Student Attendance</h2>
        <p>Mark attendance for your classes and track recent submissions.</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="attendance-grid">
          {students.map((student) => (
            <div key={student.id} className="attendance-card">
              <p>{student.name}</p>
              <div className="attendance-options">
                <button
                  type="button"
                  className={
                    attendance[student.id] === "present"
                      ? "badge present"
                      : "badge"
                  }
                  onClick={() => handleStatusChange(student.id, "present")}
                >
                  Present
                </button>
                <button
                  type="button"
                  className={
                    attendance[student.id] === "absent"
                      ? "badge absent"
                      : "badge"
                  }
                  onClick={() => handleStatusChange(student.id, "absent")}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">
          Save Attendance
        </button>
      </form>

      <div className="record-summary">
        <p>
          Total students: <strong>{students.length}</strong> · Present:{" "}
          <strong>{presentCount}</strong> · Absent:{" "}
          <strong>{students.length - presentCount}</strong>
        </p>
      </div>

      {records.length > 0 && (
        <div className="table-wrapper">
          <h3>Recent Records</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const present = record.results.filter(
                  (item) => item.status === "present",
                ).length;
                const absent = record.results.length - present;
                return (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.className}</td>
                    <td>{present}</td>
                    <td>{absent}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceTaking;
