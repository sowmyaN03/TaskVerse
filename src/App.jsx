import Taskform from './Components/Taskform';
import Tasklist from './Components/Tasklist';
import Progresstracker from './Components/Progresstracker';

export default function App() {
  return (
    <div>
      <h1>TaskVerse</h1>
      <p>Your universe, Organized.</p>
      <Taskform/>
      <Tasklist/>
      <Progresstracker/>
      <button>Clear all tasks</button>
    </div>
  )
}