import { useTranslation } from 'react-i18next'

const PRESETS = [
  { key: '7d', labelKey: 'timeline.last7Days' },
  { key: '30d', labelKey: 'timeline.last30Days' },
  { key: 'month', labelKey: 'timeline.thisMonth' },
  { key: 'custom', labelKey: 'timeline.custom' },
]

export default function DateRangePresets({ preset, onPresetChange, start, end, onCustomChange }) {
  const { t } = useTranslation()
  return (
    <div className="date-range-presets">
      <div className="chip-row">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            className={`chip${preset === p.key ? ' active' : ''}`}
            onClick={() => onPresetChange(p.key)}
          >
            {t(p.labelKey)}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div className="custom-range-inputs">
          <label>
            {t('timeline.from')}
            <input type="date" value={start} onChange={(e) => onCustomChange(e.target.value, end)} />
          </label>
          <label>
            {t('timeline.to')}
            <input type="date" value={end} onChange={(e) => onCustomChange(start, e.target.value)} />
          </label>
        </div>
      )}
    </div>
  )
}
