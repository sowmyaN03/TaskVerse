import { useState } from "react";
import { Calendar, List } from "lucide-react"; // ✅ Added icons

export default function Taskform({ addTask, setSortOption, viewMode, setViewMode }) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [dueDate, setDueDate] = useState("");

  const handlesubmit = (e) => {
    e.preventDefault();
    if (task.trim().length < 1) return;
    addTask({ text: task, priority, category, dueDate, completed: false });
    setTask("");
    setPriority("medium");
    setCategory("general");
    setDueDate("");
  };

  return (
    <form onSubmit={handlesubmit} className="task-form">
      <div id="inp">
        <input
          type="text"
          placeholder="Enter the task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </div>

      <div id="btns">
        {/* Priority */}
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Category */}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>

        {/* Due Date */}
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="schedule-btn"
        />

        {/* Sort Filter */}
        <select onChange={(e) => setSortOption(e.target.value)} defaultValue="">
          <option value="" disabled>
            Sort by...
          </option>
          <option value="priority">Priority</option>
          <option value="category">Category</option>
          <option value="dueDate">Deadline</option>
        </select>
      </div>

      {/* ✅ New View Toggle Buttons */}
      <div className="view-toggle">
        <button
          type="button"
          className={`view-btn ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          <List size={16} /> List View
        </button>
        <button
          type="button"
          className={`view-btn ${viewMode === "calendar" ? "active" : ""}`}
          onClick={() => setViewMode("calendar")}
        >
          <Calendar size={16} /> Calendar View
        </button>
      </div>
    </form>
  );
}
