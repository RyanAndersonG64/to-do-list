import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom'
import React, { createContext } from 'react'
import { useReducer } from 'react'

import App from './App'
import Header from './Header'
import Footer from './Footer'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const initialState = () => { //retrieves task data from storage, or initializes empty tasks array if there is nothing in storage
  const storage = JSON.parse(localStorage.getItem('state'))
  return {
    tasks: storage?.tasks ? storage.tasks : [],
    error: null
  }
}

const taskReducer = (state, action) => {
  switch(action.type) {
    case 'addTask': //adds new task to tasks array
      return ( 
        {
          ...state,
          tasks: [...state.tasks, {name: action.name, id: action.id, status: 'incomplete', due: action.due.getTime()}],
        }
      )
      case 'deleteTask': //performs a filter to remove task whose ID corresponds to the div whose delete button was clicked
        return ( 
          {
            ...state,
            tasks: state.tasks.filter(task => task.id !== action.id)
          }
        )
      case 'editTask': //performs a map which replaces edited task with a new one containing the new name, while all other tasks are returned with no change
            return {
              tasks: state.tasks.map(task => {
                if (task.id === action.id) {
                  const newTask = {
                    ...task,
                    name: action.name,
                  }
                  return newTask
                } else {
                  return task
                }
              }
              )
            }
      case 'markComplete': //performs a map which changed the status of the completed task, while returning other tasks with no change
        return {
          tasks: state.tasks.map(task => {
            if (task.id === action.id) {
              const newTask = {
                ...task,
                status: 'complete',
              }
              return newTask
            } else {
              return task
            }
          }
          )
        }
      default:
        throw new Error ('Skill issue')
  }
}

export const TaskContext = createContext()

const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState())

  return (
    <TaskContext.Provider value = {{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  )}

function Layout() {
  return (
    <>
      <Header />
        <div id='page-content'>
          <Outlet />
        </div>
      <Footer />
    </>
)
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <App />
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TaskProvider>
      <RouterProvider router={router} />
    </TaskProvider>
  </React.StrictMode>,
)
