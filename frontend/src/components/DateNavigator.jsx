import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function addDays(dateStr, delta) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + delta)
  return d.toISOString().slice(0, 10)
}

export default function DateNavigator({ date, onChange }) {
  const { t, i18n } = useTranslation()
  const inputRef = useRef(null)

  function formatLabel(dateStr) {
    const todayStr = new Date().toISOString().slice(0, 10)
    const yesterdayStr = addDays(todayStr, -1)
    const tomorrowStr = addDays(todayStr, 1)
    if (dateStr === todayStr) return t('day.today')
    if (dateStr === yesterdayStr) return t('day.yesterday')
    if (dateStr === tomorrowStr) return t('day.tomorrow')
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString(i18n.language, { weekday: 'long', month: 'long', day: 'numeric' })
  }

  function openPicker() {
    const el = inputRef.current
    if (el.showPicker) el.showPicker()
    else el.focus()
  }

  return (
    <div className="date-navigator">
      <button className="date-nav-arrow" onClick={() => onChange(addDays(date, -1))} aria-label="Previous day">
        <ChevronLeft size={22} />
      </button>

      <button className="date-nav-label" onClick={openPicker}>
        <Calendar size={18} />
        <span>{formatLabel(date)}</span>
      </button>
      <input
        ref={inputRef}
        type="date"
        className="date-nav-hidden-input"
        value={date}
        onChange={(e) => e.target.value && onChange(e.target.value)}
      />

      <button className="date-nav-arrow" onClick={() => onChange(addDays(date, 1))} aria-label="Next day">
        <ChevronRight size={22} />
      </button>
    </div>
  )
}
