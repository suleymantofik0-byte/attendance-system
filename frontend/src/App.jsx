import { Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from './api.js'

import Login from './pages/Login.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'

// Wraps a page so only the right role can open it.
// If you are not logged in, or you are the wrong role, you get sent to login.
function ProtectedRoute({ role, children }) {
  const user = getUser()

  if (!user) {
    return <Navigate to="/" />
  }

  if (user.role !== role) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* any unknown address goes back to login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
