import React, { useEffect, useState } from "react";
import { getSchedules } from "../../services/localStore";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

function TeachingSchedule({ teacherName }) {
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState(today);

  useEffect(() => {
    const allSchedules = getSchedules();
    const filtered = allSchedules.filter(
      (item) => item.teacher === teacherName,
    );
    setSchedule(filtered);
  }, [teacherName]);

  const visibleDays =
    selectedDay === "All" ? DAYS : DAYS.filter((day) => day === selectedDay);

  const scheduleColumns = [
    ...new Set(schedule.map((item) => `${item.class}|${item.subject}`)),
  ];

  const getComboLabel = (combo) => {
    const [className, subject] = combo.split("|");
    return `${className} / ${subject}`;
  };

  const getCellEntries = (day, combo) => {
    const [className, subject] = combo.split("|");
    return schedule.filter(
      (item) =>
        item.day === day &&
        item.class === className &&
        item.subject === subject,
    );
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Teaching Schedule</h2>
        <p>Showing your schedule for {selectedDay === "All" ? "every day" : selectedDay}.</p>
      </div>

      <div className="input-group">
        <label>Day</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          <option value="All">All Days</option>
          {DAYS.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {schedule.length === 0 ? (
        <div className="empty-state">No schedule has been assigned yet.</div>
      ) : (
        <div className="table-wrapper">
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
              {visibleDays.map((day) => (
                <tr key={day}>
                  <th>{day}</th>
                  {scheduleColumns.map((combo) => {
                    const entries = getCellEntries(day, combo);
                    return (
                      <td key={`${day}-${combo}`} className="schedule-cell">
                        {entries.length > 0 ? (
                          entries.map((entry) => (
                            <div key={entry.id} className="schedule-cell-entry">
                              <div>
                                <strong>{entry.time}</strong>
                              </div>
                              <div>Room: {entry.room}</div>
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
  );
}

export default TeachingSchedule;
