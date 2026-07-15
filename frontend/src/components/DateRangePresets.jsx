const PRESETS = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: 'month', label: 'This month' },
  { key: 'custom', label: 'Custom' },
]

export default function DateRangePresets({ preset, onPresetChange, start, end, onCustomChange }) {
  return (
    <div className="date-range-presets">
      <div className="chip-row">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            className={`chip${preset === p.key ? ' active' : ''}`}
            onClick={() => onPresetChange(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div className="custom-range-inputs">
          <label>
            From
            <input type="date" value={start} onChange={(e) => onCustomChange(e.target.value, end)} />
          </label>
          <label>
            To
            <input type="date" value={end} onChange={(e) => onCustomChange(start, e.target.value)} />
          </label>
        </div>
      )}
    </div>
  )
}
