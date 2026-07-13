import { useEffect, useState } from 'react'

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
      <div className="age-ticker-date">{now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      <div className="age-ticker-counter">
        {years}y {months}m {days}d {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </div>
    </div>
  )
}
