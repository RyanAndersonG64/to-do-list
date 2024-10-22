import { useContext, useEffect, useState } from 'react'
import './App.css'
import { TaskContext } from './main'
import { v4 as uuidv4 } from 'uuid' //used to prevent index-related bugs
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import confetti from 'canvas-confetti';

function App() {
  const [taskName, setTaskName] = useState('') //first item in task array, used in creation of task
  const { state, dispatch } = useContext(TaskContext)
  const [editStates, setEditStates] = useState({}) //used to allow editing of task names/descriptions
  const [dueDate, setDueDate] = useState(new Date()) //used to set task due dates on creation
  const currentTime = new Date() //used to check if a task is overdue



  const handleEditClick = (task) => {
    setEditStates((prevEditStates) => {
      const newEditStates = { ...prevEditStates, [task.id]: !prevEditStates[task.id] };

      if (newEditStates[task.id]) {
        // Task is now editable, set emoji to '✔️'
        task.editEmoji = '✔️';
      } else {
        // Task is no longer editable, dispatch the edit action and set emoji to '✏️'
        dispatch({ type: 'editTask', name: task.name, id: task.id, status: task.status, due: task.due });
        task.editEmoji = '✏️';
      }

      return newEditStates;
    });
  };

  const handleTaskNameChange = (task, newName) => {
    // Update the task name locally when edited
    task.name = newName;
  };

  const handleDueDateChange = (task, newDueDate) => {
    // Update the task duedate locally when edited
    task.due = newDueDate.getTime();
  };

  useEffect(() => { //saves current state to local storage every time state is changed
    localStorage.setItem('state', JSON.stringify(state))
  }, [state])

  const sortedTasks = [...state.tasks].sort((a, b) => a.due - b.due)

  const display = sortedTasks?.map(task => { //displays task after it is created
    console.log(task)
    let textColor = 'black' //default text color
    if (task.status === 'complete') {//if: green, else: red format prevents completed tasks from unnecessarily being marked overdue
      textColor = 'green' //set text color to green to indicate task has been completed
    } else if (task.due < currentTime.getTime()) { //converts currentTime date object to an integer for comparison
      textColor = 'red' //sets text color to red to indicate task is overdue
    }

    let newDate = new Date(task.due) //turns due date integer back into an object for display
    return (
      <div className='task' key={task.id}>
        <input
          defaultValue={task.name}
          readOnly={!editStates[task.id]}
          style={{ color: textColor }} //task can only be edited while editable is true
          onChange={(e) => handleTaskNameChange(task, e.target.value)}
        />
        &nbsp;
        Due:
        <DatePicker id='datePicker' readOnly={!editStates[task.id]} selected={newDate.toDateString()} onChange={(dueDate) => handleDueDateChange(task, dueDate)} />
        {/* <input
          defaultValue={newDate.toDateString()}
          readOnly={!editStates[task.id]}
          onChange={(e) => handleDueDateChange(task, e.target.value)}
        /> */}
        &nbsp;
        <button className='editTask' onClick={() => handleEditClick(task)}>
          {task.editEmoji || '✏️'}
        </button>
        <button className='deleteTask' onClick={() => {
          if (confirm('Are you sure you want to delete this task?') === true) {
            dispatch({ type: 'deleteTask', name: taskName, id: task.id, status: task.status, due: task.due })
          }  //deletes task corresponding to the delete button that was clicked
        }
        }>
          🗑️
        </button>
        <button className='markComplete' onClick={() => {
          confetti()
          dispatch({ type: 'markComplete', name: taskName, id: task.id, status: task.status, due: task.due })
        } //marks corresponding task complete, turning its text green
        }>
          ✅
        </button>
        <br></br>
      </div>
    )
  })

  return (
    <div className='addDiv'>
      <h1>To Do List</h1>
      <div id='displayDiv'>
        {display}
        <div>
          <input id='addField'
            value={taskName}
            onChange={(e) => {
              setTaskName(e.target.value) //sets input value to be added as task name
            }
            }
          >
          </input>
          {/* current date is automatically displayed in input; clicking input brings up a calander to select a date
        whatever date is in the input when 'add' is clicked will be set as task due date */}
          <DatePicker id='datePicker' selected={dueDate} onChange={(dueDate) => setDueDate(dueDate)} />
          <button className='addTask' onClick={() => {
            if (taskName !== '') { //prevents empty task from being added
              dispatch({ type: 'addTask', name: taskName, id: uuidv4(), status: 'incomplete', due: dueDate }) //adds task to be displayed
            }
            setTaskName('') //clears input field
          }
          }
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
