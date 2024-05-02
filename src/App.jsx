import { useContext, useEffect, useState } from 'react'
import './App.css'
import { TaskContext } from './main'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [taskName, setTaskName] = useState('')
  const { state, dispatch } = useContext(TaskContext)
  const [editable, setEditable] = useState(false)
  
  
  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state))
  }, [state])
  
  const display = state.tasks?.map(task => {
    return (
      <div key = { task.id }>
      <input defaultValue={ task.name } readOnly = {!editable}
      onChange={(e) => {
        if (editable === true) {
        setTaskName(e.target.value)
        console.log(task)
        }
      }
    }
      >
      </input>
      <button className = 'editTask' onClick = {() => {
        setEditable(!editable)
        if (editable == true) {
        dispatch({ type:'editTask', name: taskName, id: task.id})
        }
      }
      }>
      E
      </button>
      <button className = 'deleteTask' onClick = {() => {
        dispatch({ type:'deleteTask',name: taskName, id: task.id})
      }
        }>
      X
      </button>
      <button className = 'markComplete' onClick = {() => {
        dispatch({ type:'markComplete',name: taskName, id: task.id})
      }
        }>
      C
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
        <button className = 'addTask' onClick = {() => {
          if (taskName !== '') {
            dispatch({ type:'addTask', name: taskName, id: uuidv4()})
          } 
            setTaskName('')
            }
          }
        >
          +
        </button>
      </div>
    </div>
  )
}

export default App
