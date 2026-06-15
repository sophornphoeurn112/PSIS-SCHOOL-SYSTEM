import React, { useMemo, useState } from "react";
import {
  getSchedules,
  getStudents,
  getAcademicRecords,
  addAcademicRecord,
} from "../../services/localStore";

function GradeEntry({ teacherName }) {
  const teacherClasses = useMemo(() => {
    const mySchedules = getSchedules().filter(
      (item) => item.teacher === teacherName,
    );
    const seen = new Map();
    mySchedules.forEach((item) => {
      if (!seen.has(item.class)) {
        seen.set(item.class, { className: item.class, subjects: new Set() });
      }
      if (item.subject) seen.get(item.class).subjects.add(item.subject);
    });
    return Array.from(seen.values()).map((entry) => ({
      className: entry.className,
      subjects: Array.from(entry.subjects),
    }));
  }, [teacherName]);

  const [selectedClass, setSelectedClass] = useState(
    teacherClasses[0]?.className || "",
  );

  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return getStudents().filter(
      (student) =>
        student.studentClass === selectedClass && student.status === "active",
    );
  }, [selectedClass]);

  const subjectOptions = useMemo(() => {
    const found = teacherClasses.find(
      (item) => item.className === selectedClass,
    );
    return found?.subjects?.length ? found.subjects : ["General"];
  }, [teacherClasses, selectedClass]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [score, setScore] = useState(85);
  const [records, setRecords] = useState(() =>
    getAcademicRecords().filter((record) => record.teacher === teacherName),
  );

  const gradeFromScore = (scoreValue) => {
    if (scoreValue >= 90) return "A";
    if (scoreValue >= 80) return "B";
    if (scoreValue >= 70) return "C";
    if (scoreValue >= 60) return "D";
    return "F";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const student = classStudents.find(
      (item) => String(item.id) === String(selectedStudent),
    );
    const subject = selectedSubject || subjectOptions[0];
    if (!student || !subject) {
      alert("Please pick a class, student, and subject first.");
      return;
    }
    const newRecord = {
      id: Date.now(),
      teacher: teacherName,
      className: selectedClass,
      student: student.name,
      subject,
      score: Number(score),
      grade: gradeFromScore(Number(score)),
      date: new Date().toISOString().substring(0, 10),
    };
    addAcademicRecord(newRecord);
    setRecords((prev) => [newRecord, ...prev]);
    alert("Score saved and sent to admin!");
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Grade Entry</h2>
        <p>Enter and manage student scores for your classes.</p>
      </div>

      {teacherClasses.length === 0 ? (
        <div className="empty-state">
          You have no classes assigned yet. Ask the admin to add classes to your
          schedule.
        </div>
      ) : (
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedStudent("");
              }}
            >
              <option value="">Select Class</option>
              {teacherClasses.map((item) => (
                <option key={item.className} value={item.className}>
                  {item.className}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select Student</option>
              {classStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Score</label>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">
            Save Score
          </button>

          {selectedClass && classStudents.length === 0 && (
            <div className="empty-state">
              No students are assigned to {selectedClass} yet.
            </div>
          )}
        </form>
      )}

      {records.length > 0 && (
        <div className="table-wrapper">
          <h3>Saved Scores</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Student</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.date || "—"}</td>
                  <td>{record.className || "—"}</td>
                  <td>{record.student}</td>
                  <td>{record.subject}</td>
                  <td>{record.score}</td>
                  <td>{record.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GradeEntry;
