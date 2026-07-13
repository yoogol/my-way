import { useState } from 'react'

export default function FinancialEntryList({ entries, recurringEntries, date, onAdd, onDeleteRecurring }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState('monthly')
  const [endDate, setEndDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!amount) return
    onAdd({
      description,
      amount: parseFloat(amount),
      is_recurring: isRecurring,
      date,
      frequency: isRecurring ? frequency : null,
      end_date: isRecurring && endDate ? endDate : null,
    })
    setDescription('')
    setAmount('')
    setIsRecurring(false)
    setEndDate('')
  }

  return (
    <div className="financial-entries">
      <ul>
        {entries.map((e) => (
          <li key={e.id} className={e.amount < 0 ? 'negative' : 'positive'}>
            <span>{e.description || (e.amount < 0 ? 'Expense' : 'Income')}</span>
            <span>{e.amount}</span>
          </li>
        ))}
      </ul>

      {recurringEntries.length > 0 && (
        <div className="recurring-entries">
          <h4>Recurring</h4>
          <ul>
            {recurringEntries.map((e) => (
              <li key={e.id} className={e.amount < 0 ? 'negative' : 'positive'}>
                <span>{e.description || 'Recurring entry'} ({e.frequency})</span>
                <span>
                  {e.amount}
                  <button type="button" onClick={() => onDeleteRecurring(e.id)}>Remove</button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="financial-entry-form">
        <input
          placeholder="Description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount (+income / -expense)"
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
        />
        <label className="inline">
          <input type="checkbox" checked={isRecurring} onChange={(ev) => setIsRecurring(ev.target.checked)} />
          Recurring
        </label>
        {isRecurring && (
          <>
            <select value={frequency} onChange={(ev) => setFrequency(ev.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <label>
              Ends
              <input type="date" value={endDate} onChange={(ev) => setEndDate(ev.target.value)} />
            </label>
          </>
        )}
        <button type="submit">Add</button>
      </form>
    </div>
  )
}
