import { NavLink } from 'react-router-dom'
import { Home, ListChecks, BarChart2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const TABS = [
  { to: '/', labelKey: 'nav.today', icon: Home, end: true },
  { to: '/tasks', labelKey: 'nav.tasks', icon: ListChecks },
  { to: '/timeline', labelKey: 'nav.timeline', icon: BarChart2 },
]

export default function BottomNav() {
  const { t } = useTranslation()
  return (
    <nav className="bottom-nav">
      {TABS.map(({ to, labelKey, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `bottom-nav-tab${isActive ? ' active' : ''}`}>
          <Icon size={24} />
          <span>{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
