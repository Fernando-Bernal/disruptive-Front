import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './components/Home'


function App() {
  const [count, setCount] = useState(0)

  
  return (
    <>
      <Routes>
        <Route exact path="/home" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
