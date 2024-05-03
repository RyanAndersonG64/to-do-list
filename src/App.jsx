import { useContext, useEffect, useState } from 'react'
import './App.css'
import { TaskContext } from './main'
import { v4 as uuidv4 } from 'uuid'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [taskName, setTaskName] = useState('')
  const { state, dispatch } = useContext(TaskContext)
  const [editable, setEditable] = useState(false)
  const [dueDate, setDueDate] = useState(new Date())
  const currentTime = new Date()
  
  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state))
  }, [state])
  
  const display = state.tasks?.map(task => {
    console.log(task)
    let textColor = 'black'
    if (task.status === 'complete') {
      textColor = 'green'
    } else if (task.due < currentTime.getTime()) {
      textColor = 'red'
    }

    let newDate = new Date(task.due)
    console.log(newDate)
    return (
      <div key = { task.id }>
      <input defaultValue={ task.name } readOnly = {!editable} style = {{ color: textColor }}
      onChange={(e) => {
        if (editable === true) {
        setTaskName(e.target.value)
        console.log(task)
        }
      }
    }
      >
      </input>
        Due: { newDate.toString() }
      <button className = 'editTask' onClick = {() => {
        setEditable(!editable)
        if (editable == true) {
        dispatch({ type:'editTask', name: taskName, id: task.id, status: task.status, due: task.due})
        }
        setTaskName('')
      }
      }>
      Edit
      </button>
      <button className = 'deleteTask' onClick = {() => {
        dispatch({ type:'deleteTask',name: taskName, id: task.id, status: task.status, due: task.due})
      }
        }>
      Delete
      </button>
      <button className = 'markComplete' onClick = {() => {
        dispatch({ type:'markComplete',name: taskName, id: task.id, status: task.status, due: task.due})
      }
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
            setTaskName(e.target.value)
          }
        }
        > 
        </input>
        <DatePicker selected={dueDate} onChange={(dueDate) => setDueDate(dueDate)} />
        <button className = 'addTask' onClick = {() => {
          if (taskName !== '') {
            dispatch({ type:'addTask', name: taskName, id: uuidv4(), status: 'incomplete', due: dueDate})
            console.log('due = ', dueDate)
            console.log('number = ', dueDate.getTime())
          } 
            setTaskName('')
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
