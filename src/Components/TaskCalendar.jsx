import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/style.css";

export default function TaskCalendar({ tasks }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter tasks for the selected date
  const tasksForDate = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    return (
      due.getFullYear() === selectedDate.getFullYear() &&
      due.getMonth() === selectedDate.getMonth() &&
      due.getDate() === selectedDate.getDate()
    );
  });

  // Show small dots or previews on calendar days with tasks
  const tileContent = ({ date }) => {
    const hasTasks = tasks.some((task) => {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      return (
        due.getFullYear() === date.getFullYear() &&
        due.getMonth() === date.getMonth() &&
        due.getDate() === date.getDate()
      );
    });

    return hasTasks ? (
      <div className="calendar-dot" title="Tasks available"></div>
    ) : null;
  };

  return (
    <div className="task-calendar-container">
      <h2>📆 Task Timeline</h2>

      <div className="calendar-layout">
        {/* Left: Calendar */}
        <div className="calendar-view">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
          />
        </div>

        {/* Right: Tasks for Selected Day */}
        <div className="calendar-task-panel">
          <h3>
            {selectedDate.toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </h3>

          {tasksForDate.length > 0 ? (
            <ul className="calendar-task-list">
              {tasksForDate.map((t) => (
                <li
                  key={t.id}
                  className={`calendar-task-item priority-${t.priority}`}
                >
                  <span className="task-title">{t.text}</span>
                  <span className="task-category">{t.category}</span>
                  <span className="task-time">
                    {t.dueDate ? t.dueDate.replace("T", " ") : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-task-msg">No tasks scheduled for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
}
