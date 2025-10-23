import Taskform from "./Components/Taskform";
import Tasklist from "./Components/Tasklist";
import Progresstracker from "./Components/Progresstracker";
import TaskCalendar from "./Components/TaskCalendar";
import { useEffect, useState } from "react";
import "./styles/style.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [focusTime, setFocusTime] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [showFocusReport, setShowFocusReport] = useState(false);
  const [focusCompleted, setFocusCompleted] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // NEW: list or calendar

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks"));
    if (stored) setTasks(stored);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Timer display format
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Focus timer logic
  useEffect(() => {
    let timer;
    if (timerActive && focusTime > 0) {
      timer = setInterval(() => setFocusTime((t) => t - 1), 1000);
    } else if (focusTime === 0) {
      setTimerActive(false);
      const completedNow = tasks.filter((t) => t.completed);
      setFocusCompleted(completedNow);
      setShowFocusReport(true);
    }
    return () => clearInterval(timer);
  }, [timerActive, focusTime, tasks]);

  // Task CRUD
  const addTask = (task) => setTasks([...tasks, { ...task, id: Date.now() }]);
  const updateTask = (updatedTask, index) => {
    setTasks((prev) => {
      const newTasks = [...prev];
      newTasks[index] = updatedTask;
      return newTasks;
    });
  };
  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  // Clear All
  const openClearConfirm = () => setShowClearConfirm(true);
  const confirmClear = () => {
    setTasks([]);
    setShowClearConfirm(false);
  };
  const cancelClear = () => setShowClearConfirm(false);

  // Sorting
  const getSortedTasks = () => {
    const sorted = [...tasks];
    if (sortOption === "priority") {
      const order = { high: 1, medium: 2, low: 3 };
      sorted.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortOption === "category") {
      sorted.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortOption === "dueDate") {
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    return sorted;
  };

  // Focus Mode: only due tasks
  const getFocusTasks = () => {
    const now = new Date();
    return tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      const due = new Date(t.dueDate);
      const sameDay =
        due.getFullYear() === now.getFullYear() &&
        due.getMonth() === now.getMonth() &&
        due.getDate() === now.getDate();
      return sameDay || due < now;
    });
  };

  const tasksToDisplay = focusMode ? getFocusTasks() : getSortedTasks();

  return (
    <div className="App">
      <header>
        <h1 className="title">TaskVerse</h1>
        <p className="tagline">Your universe, Organized.</p>

        {/* Focus Mode Controls */}
        <div className="focus-controls">
          <button
            className={`focus-btn ${focusMode ? "active" : ""}`}
            onClick={() => {
              setFocusMode((f) => !f);
              setTimerActive(false);
              setFocusTime(25 * 60);
            }}
          >
            {focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
          </button>

          {focusMode && (
            <div className="focus-timer">
              <span>⏱ {formatTime(focusTime)}</span>
              <button
                onClick={() => setTimerActive((t) => !t)}
                className="timer-toggle"
              >
                {timerActive ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => {
                  setFocusTime(25 * 60);
                  setTimerActive(false);
                }}
                className="timer-reset"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Task Form */}
      <Taskform
        addTask={addTask}
        setSortOption={setSortOption}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Conditional Rendering: List or Calendar */}
      {viewMode === "list" ? (
        <Tasklist
          tasks={tasksToDisplay}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      ) : (
        <TaskCalendar tasks={tasks} />
      )}

      <Progresstracker tasks={tasks} />

      {tasks.length > 0 && (
        <button onClick={openClearConfirm} className="clear-btn">
          Clear all tasks
        </button>
      )}

      {/* Confirm Clear Modal */}
      {showClearConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Are you sure you want to clear all tasks?</p>
            <div className="confirm-actions">
              <button onClick={confirmClear} className="confirm-yes">
                Yes
              </button>
              <button onClick={cancelClear} className="confirm-no">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Focus Report */}
      {showFocusReport && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>🎯 Focus Session Report</h3>
            {focusCompleted.length > 0 ? (
              <ul>
                {focusCompleted.map((task) => (
                  <li key={task.id}>{task.text}</li>
                ))}
              </ul>
            ) : (
              <p>No tasks were completed this session.</p>
            )}
            <button
              onClick={() => {
                setShowFocusReport(false);
                setFocusCompleted([]);
              }}
              className="confirm-yes"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
