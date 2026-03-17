import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing/Landing'
import Signup from './pages/Sign-in/Signup'
import ProtectedRoute from './components/ProtectedRoutes'
import Dashboard from './pages/dashboard/Dashboard'
import LessonPage from './pages/lesson/LessonPage'        // ← add this

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

        <Route path="/lessons/:id" element={             // ← add this
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  )
}

export default App