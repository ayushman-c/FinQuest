import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Landing from './pages/landing/Landing'

import Signup from './pages/Sign-in/Signup'
import ProtectedRoute from './components/ProtectedRoutes'
import Dashboard from './pages/dashboard/Dashboard'

function App() {
  return (
    <Router>
      
      <Routes>
        
        <Route path="/" element={<Landing />} />
        
        <Route path="/sign-in" element={<Signup />} />

        <Route path="/dashboard" element={
        <ProtectedRoute>
        <Dashboard />
        </ProtectedRoute>
        } />

       
      </Routes>
    </Router>
  )
}

export default App