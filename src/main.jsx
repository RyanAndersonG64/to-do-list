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

const initialState = () => {
  const storage = JSON.parse(localStorage.getItem('state'))
  return {
    tasks: storage?.tasks ? storage.tasks : [],
    error: null
  }
}

const taskReducer = (state, action) => {
  switch(action.type) {
    case 'addTask':
      return ( 
        {
          ...state,
          tasks: [...state.tasks, {name: action.name, id: action.id, status: 'incomplete', due: action.due.getTime()}],
        }
      )
      case 'deleteTask':
        return ( 
          {
            ...state,
            tasks: state.tasks.filter(task => task.id !== action.id)
          }
        )
      case 'editTask':
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
      case 'markComplete':
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
