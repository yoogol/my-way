import { useEffect, useState } from 'react'
import { BarChart2, ListChecks, BookOpen, Newspaper, Wallet, TrendingUp } from 'lucide-react'
import { get } from '../api/client'
import { INDICATORS } from '../theme'
import DateRangePresets from '../components/DateRangePresets'
import IndicatorChart from '../components/IndicatorChart'
import IndicatorSmallMultiples from '../components/IndicatorSmallMultiples'
import EmptyState from '../components/EmptyState'

const INDICATOR_ICONS = {
  task_completion_rate: ListChecks,
  journal_length: BookOpen,
  context_event_count: Newspaper,
  financial_net: Wallet,
  financial_balance: TrendingUp,
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function monthStart() {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().slice(0, 10)
}

function rangeForPreset(preset) {
  if (preset === '7d') return { start: daysAgo(6), end: daysAgo(0) }
  if (preset === '30d') return { start: daysAgo(29), end: daysAgo(0) }
  if (preset === 'month') return { start: monthStart(), end: daysAgo(0) }
  return null
}

export default function TimelineView() {
  const [preset, setPreset] = useState('7d')
  const [start, setStart] = useState(daysAgo(6))
  const [end, setEnd] = useState(daysAgo(0))
  const [enabledKeys, setEnabledKeys] = useState(INDICATORS.map((i) => i.key))
  const [mode, setMode] = useState('small-multiples')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  function handlePresetChange(key) {
    setPreset(key)
    const range = rangeForPreset(key)
    if (range) {
      setStart(range.start)
      setEnd(range.end)
    }
  }

  function handleCustomChange(newStart, newEnd) {
    setStart(newStart)
    setEnd(newEnd)
  }

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
      <h1><BarChart2 size={26} /> Timeline</h1>
      <p className="page-subtitle">See how your days add up over time.</p>

      <DateRangePresets
        preset={preset}
        onPresetChange={handlePresetChange}
        start={start}
        end={end}
        onCustomChange={handleCustomChange}
      />

      <div className="chip-row indicator-toggles">
        {INDICATORS.map((ind) => {
          const Icon = INDICATOR_ICONS[ind.key]
          const active = enabledKeys.includes(ind.key)
          return (
            <button
              key={ind.key}
              className={`chip${active ? ' active' : ''}`}
              onClick={() => toggleIndicator(ind.key)}
            >
              <Icon size={16} />
              {ind.label}
            </button>
          )
        })}
      </div>

      <div className="segmented-control">
        <button className={mode === 'combined' ? 'active' : ''} onClick={() => setMode('combined')}>
          Combined
        </button>
        <button className={mode === 'small-multiples' ? 'active' : ''} onClick={() => setMode('small-multiples')}>
          One at a time
        </button>
      </div>

      {loading ? (
        <p className="loading-text">Loading…</p>
      ) : enabledKeys.length === 0 ? (
        <EmptyState icon={BarChart2} message="Pick at least one thing above to see it on the chart." />
      ) : mode === 'combined' ? (
        <IndicatorChart data={data} enabledKeys={enabledKeys} />
      ) : (
        <IndicatorSmallMultiples data={data} enabledKeys={enabledKeys} />
      )}
    </div>
  )
}
