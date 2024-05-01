import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom'
import { createContext } from 'react'
import React, { useReducer } from 'react'

import App from './App'
import Header from './Header'
import Footer from './Footer'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
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
       
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
