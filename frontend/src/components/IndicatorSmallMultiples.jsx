import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { INDICATORS, seriesColor, usePrefersDark } from '../theme'

export default function IndicatorSmallMultiples({ data, enabledKeys }) {
  const { t } = useTranslation()
  const isDark = usePrefersDark()
  const indicators = INDICATORS.filter((i) => enabledKeys.includes(i.key))

  return (
    <div className="small-multiples-grid">
      {indicators.map((ind) => (
        <div className="chart-card" key={ind.key}>
          <h3>{t(`indicator.${ind.key}`)}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="0" stroke="var(--gridline)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }} />
              <Line
                type="monotone"
                dataKey={ind.key}
                name={t(`indicator.${ind.key}`)}
                stroke={seriesColor(ind, isDark)}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}
