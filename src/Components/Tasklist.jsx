import { useState, useEffect } from "react";

export default function Tasklist({ tasks, updateTask, deleteTask }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [avgDelay, setAvgDelay] = useState(0); // For predictive color logic

  // Calculate average delay from completed tasks
  useEffect(() => {
    const completedTasks = tasks.filter((t) => t.completed && t.dueDate);
    if (completedTasks.length > 0) {
      const totalDelay = completedTasks.reduce((sum, t) => {
        const due = new Date(t.dueDate);
        const completed = new Date(t.completedAt || Date.now());
        return sum + (completed - due);
      }, 0);
      setAvgDelay(totalDelay / completedTasks.length);
    } else {
      setAvgDelay(0);
    }
  }, [tasks]);

  // Mark complete/incomplete
  const toggleComplete = (index) => {
    const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
    if (updatedTask.completed && !updatedTask.completedAt) {
      updatedTask.completedAt = new Date().toISOString();
    }
    updateTask(updatedTask, index);
  };

  // Delete confirmation handlers
  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) deleteTask(taskToDelete);
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  // Determine predictive color class based on due date
  const getRowClass = (task) => {
    if (!task.dueDate || task.completed) return "";
    const due = new Date(task.dueDate);
    const now = new Date();
    const predictedLate = new Date(now.getTime() + avgDelay);

    if (due < now) return "overdue"; // 🔴 already late
    if (predictedLate > due) return "at-risk"; // 🟡 predicted to be late
    return "on-track"; // 🟢 safe
  };

  return (
    <>
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "12px" }}>
                No tasks yet.
              </td>
            </tr>
          ) : (
            tasks.map((task, index) => (
              <tr
                key={task.id || index}
                className={`${task.completed ? "completed" : ""} ${getRowClass(
                  task
                )}`}
              >
                <td>{task.text}</td>
                <td className={`priority-${task.priority}`}>
                  {task.priority}
                </td>
                <td>{task.category}</td>
                <td>
                  {task.dueDate ? task.dueDate.replace("T", " ") : "—"}
                </td>
                <td>{task.completed ? "Completed" : "Pending"}</td>
                <td className="task-actions">
                  <button onClick={() => toggleComplete(index)}>
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Confirm Delete Modal */}
      {showDeleteConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Are you sure you want to delete this task?</p>
            <div className="confirm-actions">
              <button onClick={confirmDelete} className="confirm-yes">
                Yes
              </button>
              <button onClick={cancelDelete} className="confirm-no">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
