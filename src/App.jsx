import Taskform from './Components/Taskform';
import Tasklist from './Components/Tasklist';
import Progresstracker from './Components/Progresstracker';
import { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    localStorage.setItem
    ("tasks", JSON.stringify(tasks))
  });

  const addTask = (task) => {
    setTasks([...tasks,task]);
  }

  return (
    <div>
      <h1>TaskVerse</h1>
      <p>Your universe, Organized.</p>
      <Taskform addTask={addTask}/>
      <Tasklist/>
      <Progresstracker/>
      <button>Clear all tasks</button>
    </div>
  )
}