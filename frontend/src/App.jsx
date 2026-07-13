import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { isAuthenticated, logout } from './api/client'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DayView from './pages/DayView'
import TaskAdminView from './pages/TaskAdminView'
import TimelineView from './pages/TimelineView'

function NavBar() {
  const location = useLocation()
  if (!isAuthenticated()) return null

  return (
    <nav className="app-nav">
      <span className="brand">my-way</span>
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Today</Link>
      <Link to="/tasks" className={location.pathname === '/tasks' ? 'active' : ''}>Tasks</Link>
      <Link to="/timeline" className={location.pathname === '/timeline' ? 'active' : ''}>Timeline</Link>
      <span className="spacer" />
      <button onClick={() => { logout(); window.location.href = '/login' }}>Log out</button>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><DayView /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TaskAdminView /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><TimelineView /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
