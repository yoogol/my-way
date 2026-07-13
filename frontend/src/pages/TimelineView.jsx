import { useEffect, useState } from 'react'
import { get } from '../api/client'
import { INDICATORS } from '../theme'
import IndicatorChart from '../components/IndicatorChart'
import IndicatorSmallMultiples from '../components/IndicatorSmallMultiples'

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export default function TimelineView() {
  const [start, setStart] = useState(daysAgo(30))
  const [end, setEnd] = useState(daysAgo(0))
  const [enabledKeys, setEnabledKeys] = useState(INDICATORS.map((i) => i.key))
  const [mode, setMode] = useState('combined')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    get(`/indicators/summary/?start=${start}&end=${end}`).then((rows) => {
      setData(rows)
      setLoading(false)
    })
  }, [start, end])

  function toggleIndicator(key) {
    setEnabledKeys((keys) => (keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]))
  }

  return (
    <div className="timeline-view">
      <h1>Timeline</h1>

      <div className="timeline-controls">
        <label>
          From
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>

        <div className="segmented-control">
          <button className={mode === 'combined' ? 'active' : ''} onClick={() => setMode('combined')}>
            Combined
          </button>
          <button className={mode === 'small-multiples' ? 'active' : ''} onClick={() => setMode('small-multiples')}>
            Small multiples
          </button>
        </div>
      </div>

      <div className="indicator-toggles">
        {INDICATORS.map((ind) => (
          <label key={ind.key} className="inline">
            <input
              type="checkbox"
              checked={enabledKeys.includes(ind.key)}
              onChange={() => toggleIndicator(ind.key)}
            />
            {ind.label}
          </label>
        ))}
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : enabledKeys.length === 0 ? (
        <p className="empty-hint">Select at least one indicator.</p>
      ) : mode === 'combined' ? (
        <IndicatorChart data={data} enabledKeys={enabledKeys} />
      ) : (
        <IndicatorSmallMultiples data={data} enabledKeys={enabledKeys} />
      )}
    </div>
  )
}
