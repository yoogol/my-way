import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { INDICATORS, seriesColor, usePrefersDark } from '../theme'

// Combined view compares trend shape across indicators of different native units
// (a rate, a character count, a dollar amount, …) on ONE shared axis — so each
// series is indexed to 0-100 within the displayed range rather than plotted in
// native units. Native units are still available per-indicator in small-multiples mode.
function indexSeries(data, keys) {
  const bounds = {}
  for (const key of keys) {
    const values = data.map((d) => d[key]).filter((v) => v !== null && v !== undefined)
    bounds[key] = { min: Math.min(...values, 0), max: Math.max(...values, 0) }
  }
  return data.map((d) => {
    const row = { date: d.date }
    for (const key of keys) {
      const { min, max } = bounds[key]
      const v = d[key]
      row[key] = v === null || v === undefined ? null : max === min ? 0 : ((v - min) / (max - min)) * 100
    }
    return row
  })
}

export default function IndicatorChart({ data, enabledKeys }) {
  const isDark = usePrefersDark()
  const indicators = INDICATORS.filter((i) => enabledKeys.includes(i.key))
  const indexed = indexSeries(data, enabledKeys)

  return (
    <div className="chart-card">
      <h3>Combined (indexed 0–100)</h3>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={indexed} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="0" stroke="var(--gridline)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 100]} />
          <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }} />
          {indicators.length > 1 && <Legend />}
          {indicators.map((ind) => (
            <Line
              key={ind.key}
              type="monotone"
              dataKey={ind.key}
              name={ind.label}
              stroke={seriesColor(ind, isDark)}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
