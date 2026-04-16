import { useState, memo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Router, RouterProvider } from 'react-router'
import router from './routes/router'


function App() {


  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default memo(App)
