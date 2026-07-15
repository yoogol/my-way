import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './App.css'
import { isAuthenticated, logout } from './api/client'
import { ToastProvider } from './contexts/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import BottomNav from './components/BottomNav'
import SettingsMenu from './components/SettingsMenu'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DayView from './pages/DayView'
import TaskAdminView from './pages/TaskAdminView'
import TimelineView from './pages/TimelineView'

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  return null
}

const AUTH_ROUTES = ['/login', '/register']

function TopBar() {
  const location = useLocation()
  const { t } = useTranslation()
  if (!isAuthenticated() || AUTH_ROUTES.includes(location.pathname)) return null
  return (
    <header className="top-bar">
      <span className="brand-group">
        <span className="brand">{t('app.title')}</span>
        <span className="tagline">{t('app.tagline')}</span>
      </span>
      <SettingsMenu onLogout={() => { logout(); window.location.href = '/login' }} />
    </header>
  )
}

function BottomNavGate() {
  const location = useLocation()
  if (!isAuthenticated() || AUTH_ROUTES.includes(location.pathname)) return null
  return <BottomNav />
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <TopBar />
        <div className="app-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProtectedRoute><DayView /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><TaskAdminView /></ProtectedRoute>} />
            <Route path="/timeline" element={<ProtectedRoute><TimelineView /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <BottomNavGate />
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
