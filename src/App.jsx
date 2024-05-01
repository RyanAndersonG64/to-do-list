import { useContext, useState } from 'react'
import './App.css'
import { TaskContext } from './main'

function App() {
  const [task, setTask] = useState('')
  const { state } = useContext(TaskContext)
  console.log(state.task)

  return (
    <div className='appDiv'>
      <div>
        <input
          value = { task }
          onChange={(e) => {
            setTask(e.target.value)
            console.log('task in input = ' + task)
          }}
        > 
        </input>
      </div>
      <button className='addTask' onClick = {() => dispatchEvent({ type:'addTask', name: task })}>
        +
      </button>
    </div>
  )
}

export default App
