import { useState } from 'react'

import Navbar from './containters/Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div >
        <Navbar />
        <div >
          <Routes>
            <Route path="/home" element={<h1 className="text-7xl font-bold underline text-red-500">Hello world!</h1>} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  )
}
export default App
