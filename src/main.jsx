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

const initialState = {
  task: [],
  error: null
}

const taskReducer = (state, action) => {
  switch(action.type) {
    case 'addTask':
      return ( 
      {
        ...state,
        task: [state.task,{name: action.name}],
      }
    )
      default:
      throw new Error ('Skill issue')
  }
}

export const TaskContext = createContext()

const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  return (
    <TaskContext.Provider value = {( state, dispatch)}>
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
    path: "/",
    element: <Layout />,
    // loader: rootLoader,
    children: [
      {
        path: '/App',
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
