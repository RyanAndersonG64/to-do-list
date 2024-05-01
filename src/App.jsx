import { useState } from 'react'
import './App.css'

function App() {
  const [task, setTask] = useState('')

  return (
    <div className='appDiv'>
      <input
        value = { task }
        onChange={(e) => {
          setTask(e.target.value)
          console.log('task in input = ' + task)
        }}
      > 
      </input>
    </div>
  )
}

export default App
