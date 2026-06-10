import React, { useEffect, useState } from "react";
import {
  getSchedules,
  saveSchedules,
  getTeacherAccounts,
  GRADE_OPTIONS,
} from "../../services/localStore";
import "./AdminManagement.css";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function ScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    class: "",
    teacher: "",
    subject: "",
    day: "",
    time: "",
    room: "",
  });

  useEffect(() => {
    setSchedules(getSchedules());
    setTeachers(getTeacherAccounts());
  }, []);

  const scheduleColumns = [
    ...new Set(
      schedules.map((schedule) => `${schedule.class}|${schedule.subject}`),
    ),
  ];

  const getComboLabel = (combo) => {
    const [className, subject] = combo.split("|");
    return `${className} / ${subject}`;
  };

  const getCellEntries = (day, combo) => {
    const [className, subject] = combo.split("|");
    return schedules.filter(
      (schedule) =>
        schedule.day === day &&
        schedule.class === className &&
        schedule.subject === subject,
    );
  };

  const handleCreateSchedule = (e) => {
    e.preventDefault();

    const hasConflict = schedules.some(
      (schedule) =>
        schedule.day === newSchedule.day &&
        schedule.time === newSchedule.time &&
        (schedule.teacher === newSchedule.teacher ||
          schedule.room === newSchedule.room),
    );

    if (hasConflict) {
      alert(
        "⚠️ Timetable Conflict!\nTeacher or room is already scheduled for this time.",
      );
      return;
    }

    if (
      newSchedule.class &&
      newSchedule.teacher &&
      newSchedule.subject &&
      newSchedule.day &&
      newSchedule.time &&
      newSchedule.room
    ) {
      const schedule = {
        id: Date.now(),
        ...newSchedule,
      };
      const updated = [...schedules, schedule];
      setSchedules(updated);
      saveSchedules(updated);
      setNewSchedule({
        class: "",
        teacher: "",
        subject: "",
        day: "",
        time: "",
        room: "",
      });
      setShowCreateForm(false);
      alert("✓ Schedule created and sent to teacher and student accounts!");
    }
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm("Delete this schedule?")) {
      const updated = schedules.filter((schedule) => schedule.id !== id);
      setSchedules(updated);
      saveSchedules(updated);
    }
  };

  const handleTeacherChange = (event) => {
    const teacherName = event.target.value;
    const teacher = teachers.find((item) => item.name === teacherName);
    setNewSchedule((prev) => ({
      ...prev,
      teacher: teacherName,
      subject: teacher?.subject || "",
    }));
  };

  return (
    <div className="management-section">
      <h2>Class Schedule Management</h2>

      <button
        className="btn-primary"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        {showCreateForm ? "Cancel" : "+ Create Schedule"}
      </button>

      {showCreateForm && (
        <form className="form-container" onSubmit={handleCreateSchedule}>
          <select
            value={newSchedule.class}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, class: e.target.value })
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
          <select
            value={newSchedule.teacher}
            onChange={handleTeacherChange}
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.name}>
                {teacher.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Subject"
            value={newSchedule.subject}
            disabled
            readOnly
          />
          <select
            value={newSchedule.day}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, day: e.target.value })
            }
            required
          >
            <option value="">Select Day</option>
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Time (e.g., 09:00-10:00)"
            value={newSchedule.time}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, time: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Room"
            value={newSchedule.room}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, room: e.target.value })
            }
            required
          />
          <button type="submit" className="btn-success">
            Create Schedule
          </button>
          <div className="form-note">
            Choose a teacher first and the subject will fill automatically.
          </div>
        </form>
      )}

      <div className="table-container">
        {schedules.length === 0 ? (
          <div className="empty-state">No schedule data available yet.</div>
        ) : (
          <div className="excel-schedule-wrapper">
            <table className="schedule-grid">
              <thead>
                <tr>
                  <th>Day</th>
                  {scheduleColumns.map((combo) => (
                    <th key={combo}>{getComboLabel(combo)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day}>
                    <th>{day}</th>
                    {scheduleColumns.map((combo) => {
                      const entries = getCellEntries(day, combo);
                      return (
                        <td key={`${day}-${combo}`} className="schedule-cell">
                          {entries.length > 0 ? (
                            entries.map((entry) => (
                              <div
                                key={entry.id}
                                className="schedule-cell-entry"
                              >
                                <div>
                                  <strong>{entry.time}</strong>
                                </div>
                                <div>Teacher: {entry.teacher}</div>
                                <div>Room: {entry.room}</div>
                                <button
                                  className="btn-sm btn-danger"
                                  type="button"
                                  onClick={() => handleDeleteSchedule(entry.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="empty-cell">No assignment</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleManagement;
