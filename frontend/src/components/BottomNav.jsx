import { NavLink } from 'react-router-dom'
import { Home, ListChecks, BarChart2 } from 'lucide-react'

const TABS = [
  { to: '/', label: 'Today', icon: Home, end: true },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/timeline', label: 'Timeline', icon: BarChart2 },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `bottom-nav-tab${isActive ? ' active' : ''}`}>
          <Icon size={24} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
