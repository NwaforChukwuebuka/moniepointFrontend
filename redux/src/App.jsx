import { useState, memo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Counter from './components/Counter'

function App() {
  return (
  
    //mount Counter component here
      <Counter />
  
  )
} 
console.log(App)
export default memo(App)