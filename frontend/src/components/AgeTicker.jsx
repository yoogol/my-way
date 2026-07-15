import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function diff(birth, now) {
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  let days = now.getDate() - birth.getDate()
  let h = now.getHours() - birth.getHours()
  let m = now.getMinutes() - birth.getMinutes()
  let s = now.getSeconds() - birth.getSeconds()

  if (s < 0) { s += 60; m-- }
  if (m < 0) { m += 60; h-- }
  if (h < 0) { h += 24; days-- }
  if (days < 0) {
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate()
    days += prevMonthLastDay
    months--
  }
  if (months < 0) { months += 12; years-- }

  return { years, months, days, h, m, s }
}

export default function AgeTicker({ birthDatetime }) {
  const { t, i18n } = useTranslation()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!birthDatetime) return null

  const birth = new Date(birthDatetime)
  const { years, months, days, h, m, s } = diff(birth, now)

  return (
    <div className="age-ticker">
      <div className="age-ticker-date">
        {now.toLocaleDateString(i18n.language, { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="age-ticker-label">{t('ageTicker.aliveFor')}</div>
      <div className="age-ticker-stats">
        <div className="age-stat"><span className="age-stat-value">{years}</span><span className="age-stat-unit">{t('ageTicker.years', { count: years })}</span></div>
        <div className="age-stat"><span className="age-stat-value">{months}</span><span className="age-stat-unit">{t('ageTicker.months', { count: months })}</span></div>
        <div className="age-stat"><span className="age-stat-value">{days}</span><span className="age-stat-unit">{t('ageTicker.days', { count: days })}</span></div>
      </div>
      <div className="age-ticker-clock">
        {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </div>
    </div>
  )
}
