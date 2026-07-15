import { useState } from 'react'
import { Plus, Wallet, ArrowUpRight, ArrowDownRight, Repeat, Trash2 } from 'lucide-react'
import EmptyState from './EmptyState'
import { useToast } from '../contexts/ToastContext'

function AmountPill({ amount }) {
  const isIncome = amount >= 0
  return (
    <span className={`amount-pill ${isIncome ? 'positive' : 'negative'}`}>
      {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      {Math.abs(amount).toFixed(2)}
    </span>
  )
}

export default function FinancialEntryList({ entries, recurringEntries, date, onAdd, onDeleteRecurring }) {
  const [showForm, setShowForm] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [isIncome, setIsIncome] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState('monthly')
  const [endDate, setEndDate] = useState('')
  const showToast = useToast()

  function resetForm() {
    setDescription('')
    setAmount('')
    setIsIncome(false)
    setIsRecurring(false)
    setEndDate('')
    setShowForm(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!amount) return
    const signedAmount = Math.abs(parseFloat(amount)) * (isIncome ? 1 : -1)
    onAdd({
      description,
      amount: signedAmount,
      is_recurring: isRecurring,
      date,
      frequency: isRecurring ? frequency : null,
      end_date: isRecurring && endDate ? endDate : null,
    })
    resetForm()
    showToast('Added')
  }

  const hasAny = entries.length > 0 || recurringEntries.length > 0

  return (
    <div className="financial-entries">
      {!hasAny && !showForm ? (
        <EmptyState
          icon={Wallet}
          message="No money in or out logged for this day yet."
          actionLabel="+ Add an amount"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <>
          {entries.length > 0 && (
            <ul>
              {entries.map((e) => (
                <li key={e.id}>
                  <span>{e.description || (e.amount < 0 ? 'Expense' : 'Income')}</span>
                  <AmountPill amount={parseFloat(e.amount)} />
                </li>
              ))}
            </ul>
          )}

          {recurringEntries.length > 0 && (
            <div className="recurring-entries">
              <h4><Repeat size={14} /> Recurring</h4>
              <ul>
                {recurringEntries.map((e) => (
                  <li key={e.id}>
                    <span>{e.description || 'Recurring entry'} <span className="recurring-frequency">({e.frequency})</span></span>
                    <span className="recurring-actions">
                      <AmountPill amount={parseFloat(e.amount)} />
                      <button type="button" className="icon-button" onClick={() => onDeleteRecurring(e.id)}>
                        <Trash2 size={16} />
                        <span>Remove</span>
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!showForm && (
            <button className="add-more-button" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              <span>Add another amount</span>
            </button>
          )}
        </>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="financial-entry-form">
          <input
            placeholder="What's it for? (e.g. Groceries)"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            autoFocus
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            value={amount}
            onChange={(ev) => setAmount(ev.target.value)}
          />
          <div className="segmented-control">
            <button type="button" className={!isIncome ? 'active' : ''} onClick={() => setIsIncome(false)}>Money out</button>
            <button type="button" className={isIncome ? 'active' : ''} onClick={() => setIsIncome(true)}>Money in</button>
          </div>
          <label className="inline">
            <input type="checkbox" checked={isRecurring} onChange={(ev) => setIsRecurring(ev.target.checked)} />
            This repeats
          </label>
          {isRecurring && (
            <>
              <select value={frequency} onChange={(ev) => setFrequency(ev.target.value)}>
                <option value="daily">Every day</option>
                <option value="weekly">Every week</option>
                <option value="monthly">Every month</option>
                <option value="yearly">Every year</option>
              </select>
              <label>
                Ends (optional)
                <input type="date" value={endDate} onChange={(ev) => setEndDate(ev.target.value)} />
              </label>
            </>
          )}
          <div className="form-actions">
            <button type="button" onClick={resetForm}>Cancel</button>
            <button type="submit" className="button-accent">Add</button>
          </div>
        </form>
      )}
    </div>
  )
}
