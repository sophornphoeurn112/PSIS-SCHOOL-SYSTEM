import React, { useMemo, useState } from "react";
import {
  getSchedules,
  getStudents,
  getAcademicRecords,
  addAcademicRecord,
} from "../../services/localStore";

const PERIOD_OPTIONS = [
  "Monthly - January",
  "Monthly - February",
  "Monthly - March",
  "Monthly - April",
  "Monthly - May",
  "Monthly - June",
  "Monthly - July",
  "Monthly - August",
  "Monthly - September",
  "Monthly - October",
  "Monthly - November",
  "Monthly - December",
  "Semester 1",
  "Semester 2",
];

const RECOMMENDATION_OPTIONS = [
  "Excellent behavior",
  "Good behavior",
  "Active participation",
  "Polite and respectful",
  "Hardworking",
  "Needs to improve focus",
  "Talks too much in class",
  "Often absent",
  "Needs more practice at home",
];

// Primary school (Grade 1-6) is marked out of 10, otherwise out of 100.
const getMaxScore = (className) => {
  const match = (className || "").match(/\d+/);
  const gradeNumber = match ? Number(match[0]) : null;
  if (gradeNumber !== null && gradeNumber >= 1 && gradeNumber <= 6) return 10;
  return 100;
};

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

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [started, setStarted] = useState(false);
  const [entries, setEntries] = useState({});
  const [records, setRecords] = useState(() =>
    getAcademicRecords().filter((record) => record.teacher === teacherName),
  );

  const subjectOptions = useMemo(() => {
    const found = teacherClasses.find(
      (item) => item.className === selectedClass,
    );
    return found?.subjects?.length ? found.subjects : ["General"];
  }, [teacherClasses, selectedClass]);

  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return getStudents().filter(
      (student) =>
        student.studentClass === selectedClass && student.status === "active",
    );
  }, [selectedClass]);

  const maxScore = getMaxScore(selectedClass);
  const readyToEnter = selectedClass && selectedSubject && selectedPeriod;

  const gradeFromPercent = (percent) => {
    if (percent >= 90) return "A";
    if (percent >= 80) return "B";
    if (percent >= 70) return "C";
    if (percent >= 60) return "D";
    return "F";
  };

  const getEntryScore = (id) =>
    entries[id]?.score !== undefined ? entries[id].score : "";
  const getEntryReco = (id) => entries[id]?.recommendation || "";

  const handleScoreChange = (id, value) => {
    setEntries((prev) => ({
      ...prev,
      [id]: { ...prev[id], score: value },
    }));
  };

  const handleRecoChange = (id, value) => {
    setEntries((prev) => ({
      ...prev,
      [id]: { ...prev[id], recommendation: value },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!readyToEnter) {
      alert("Please select class, subject, and month/semester first.");
      return;
    }
    const scored = classStudents.filter(
      (student) => getEntryScore(student.id) !== "",
    );
    if (scored.length === 0) {
      alert("Enter at least one score before saving.");
      return;
    }
    const newRecords = scored.map((student) => {
      const score = Number(getEntryScore(student.id));
      const percent = (score / maxScore) * 100;
      return {
        id: `${Date.now()}-${student.id}`,
        teacher: teacherName,
        className: selectedClass,
        subject: selectedSubject,
        period: selectedPeriod,
        student: student.name,
        score,
        maxScore,
        grade: gradeFromPercent(percent),
        recommendation: getEntryReco(student.id),
        date: new Date().toISOString().substring(0, 10),
      };
    });
    newRecords.forEach((record) => addAcademicRecord(record));
    setRecords((prev) => [...newRecords, ...prev]);
    setEntries({});
    alert(`${newRecords.length} score(s) saved and sent to admin!`);
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Enter Scores</h2>
        <p>Select a class, subject, and period, then score each student.</p>
      </div>

      {teacherClasses.length === 0 ? (
        <div className="empty-state">
          You have no classes assigned yet. Ask the admin to add classes to your
          schedule.
        </div>
      ) : !started ? (
        <div className="form-grid">
          <div className="input-group">
            <label>Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSubject("");
                setEntries({});
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
            <label>Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedClass}
            >
              <option value="">Select Subject</option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Month / Semester</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="">Select Period</option>
              {PERIOD_OPTIONS.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="submit-btn"
            disabled={!readyToEnter}
            onClick={() => setStarted(true)}
          >
            Continue →
          </button>
        </div>
      ) : (
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="selection-bar">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setStarted(false);
                setEntries({});
              }}
            >
              ← Change selection
            </button>
            <h3 className="selection-title">
              {selectedClass} · {selectedSubject} · {selectedPeriod}
            </h3>
          </div>

          {classStudents.length === 0 ? (
            <div className="empty-state">
              No students are assigned to {selectedClass} yet.
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Score (max {maxScore})</th>
                      <th>Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={maxScore}
                            placeholder={`0 - ${maxScore}`}
                            value={getEntryScore(student.id)}
                            onChange={(e) =>
                              handleScoreChange(student.id, e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <select
                            value={getEntryReco(student.id)}
                            onChange={(e) =>
                              handleRecoChange(student.id, e.target.value)
                            }
                          >
                            <option value="">Select recommendation</option>
                            {RECOMMENDATION_OPTIONS.map((reco) => (
                              <option key={reco} value={reco}>
                                {reco}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button type="submit" className="submit-btn">
                Save Scores
              </button>
            </>
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
                <th>Subject</th>
                <th>Period</th>
                <th>Student</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.date || "—"}</td>
                  <td>{record.className || "—"}</td>
                  <td>{record.subject}</td>
                  <td>{record.period || "—"}</td>
                  <td>{record.student}</td>
                  <td>
                    {record.score}
                    {record.maxScore ? ` / ${record.maxScore}` : ""}
                  </td>
                  <td>{record.grade}</td>
                  <td>{record.recommendation || "—"}</td>
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
