import React, { useState } from "react";

const students = [
  { id: 1, name: "Aisha Benson" },
  { id: 2, name: "David Kim" },
  { id: 3, name: "Mina Patel" },
  { id: 4, name: "Isaac Chen" },
  { id: 5, name: "Rita Gomez" },
];

const subjects = ["Mathematics", "Science", "English", "History", "Art"];

function GradeEntry() {
  const [selectedStudent, setSelectedStudent] = useState(students[0].id);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [score, setScore] = useState(85);
  const [records, setRecords] = useState([]);

  const gradeFromScore = (scoreValue) => {
    if (scoreValue >= 90) return "A";
    if (scoreValue >= 80) return "B";
    if (scoreValue >= 70) return "C";
    if (scoreValue >= 60) return "D";
    return "F";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const student = students.find(
      (item) => item.id === Number(selectedStudent),
    );
    const newRecord = {
      id: Date.now(),
      student: student.name,
      subject: selectedSubject,
      score: Number(score),
      grade: gradeFromScore(Number(score)),
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Grade Entry</h2>
        <p>Enter and manage student scores for your classes.</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Student</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            {students.map((student) => (
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
            {subjects.map((subject) => (
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
      </form>

      {records.length > 0 && (
        <div className="table-wrapper">
          <h3>Saved Scores</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
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
