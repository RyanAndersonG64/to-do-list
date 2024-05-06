import { useContext, useEffect, useState } from 'react'
import './App.css'
import { TaskContext } from './main'
import { v4 as uuidv4 } from 'uuid' //used to prevent index-related bugs
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [taskName, setTaskName] = useState('') //first item in task array, used in creation of task
  const { state, dispatch } = useContext(TaskContext)
  const [editable, setEditable] = useState(false) //used to allow editing of task names/descriptions
  const [dueDate, setDueDate] = useState(new Date()) //used to set task due dates on creation
  const currentTime = new Date() //used to check if a task is overdue
  
  useEffect(() => { //saves current state to local storage every time state is changed
    localStorage.setItem('state', JSON.stringify(state))
  }, [state])
  
  const display = state.tasks?.map(task => { //displays task after it is created
    console.log(task)
    let textColor = 'black' //default text color
    if (task.status === 'complete') {//if: green, else: red format prevents completed tasks from unnecessarily being marked overdue
      textColor = 'green' //set text color to green to indicate task has been completed
    } else if (task.due < currentTime.getTime()) { //converts currentTime date object to an integer for comparison
      textColor = 'red' //sets text color to red to indicate task is overdue
    }

    let newDate = new Date(task.due) //turns due date integer back into an object for display
    console.log(newDate)
    return (
      <div key = { task.id }>
      <input defaultValue={ task.name } readOnly = {!editable} style = {{ color: textColor }} //task can only be edited while editable is true
      onChange={(e) => {
        if (editable === true) {
        setTaskName(e.target.value) //allows task name to be changed in local storage when edit button is pressed again
        console.log(task)
        }
      }
    }
      >
      </input>
        Due: { newDate.toString() }
      <button className = 'editTask' onClick = {() => {
        setEditable(!editable) //allows for editing of task, or saves edit and blocks further editing unless button is pressed again
        if (editable == true) { //if editable is false, task could not have been changed to there is no need to dispatch edit
        dispatch({ type:'editTask', name: taskName, id: task.id, status: task.status, due: task.due}) //saves new task name to local storage
        }
        setTaskName('') //for some reason the edited task name also appears in the add field, this clears it when edit is dispatched
      }
      }>
      Edit
      </button>
      <button className = 'deleteTask' onClick = {() => {
        dispatch({ type:'deleteTask',name: taskName, id: task.id, status: task.status, due: task.due})
      }  //deletes task corresponding to the delete button that was clicked
        }>
      Delete
      </button>
      <button className = 'markComplete' onClick = {() => {
        dispatch({ type:'markComplete',name: taskName, id: task.id, status: task.status, due: task.due})
      } //marks corresponding task complete, turning its text green
        }>
      Complete
      </button>
      </div>
      )
  })

  return (
    <div className='addDiv'>
      <h1>To Do List</h1>
      <div className='displayDiv'>
        { display }
      </div>
      <div>
        <input id = 'addField'
          value = { taskName }
          onChange={(e) => {
            setTaskName(e.target.value) //sets input value to be added as task name
          }
        }
        > 
        </input>
        {/* current date is automatically displayed in input; clicking input brings up a calander to select a date
        whatever date is in the input when 'add' is clicked will be set as task due date */}
        <DatePicker selected={dueDate} onChange={(dueDate) => setDueDate(dueDate)} /> 
        <button className = 'addTask' onClick = {() => {
          if (taskName !== '') { //prevents empty task from being added
            dispatch({ type:'addTask', name: taskName, id: uuidv4(), status: 'incomplete', due: dueDate}) //adds task to be displayed
            console.log('due = ', dueDate)
            console.log('number = ', dueDate.getTime())
          } 
            setTaskName('') //clears input field
            }
          }
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default App
