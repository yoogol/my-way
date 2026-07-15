import { useState } from 'react'
import { Plus, Wallet, ArrowUpRight, ArrowDownRight, Repeat, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
    showToast(t('financial.toastAdded'))
  }

  const hasAny = entries.length > 0 || recurringEntries.length > 0

  return (
    <div className="financial-entries">
      {!hasAny && !showForm ? (
        <EmptyState
          icon={Wallet}
          message={t('financial.emptyHint')}
          actionLabel={t('financial.addAmount')}
          onAction={() => setShowForm(true)}
        />
      ) : (
        <>
          {entries.length > 0 && (
            <ul>
              {entries.map((e) => (
                <li key={e.id}>
                  <span>{e.description || (e.amount < 0 ? t('financial.expense') : t('financial.income'))}</span>
                  <AmountPill amount={parseFloat(e.amount)} />
                </li>
              ))}
            </ul>
          )}

          {recurringEntries.length > 0 && (
            <div className="recurring-entries">
              <h4><Repeat size={14} /> {t('financial.recurring')}</h4>
              <ul>
                {recurringEntries.map((e) => (
                  <li key={e.id}>
                    <span>{e.description || t('financial.recurringEntry')} <span className="recurring-frequency">({e.frequency})</span></span>
                    <span className="recurring-actions">
                      <AmountPill amount={parseFloat(e.amount)} />
                      <button type="button" className="icon-button" onClick={() => onDeleteRecurring(e.id)}>
                        <Trash2 size={16} />
                        <span>{t('financial.remove')}</span>
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
              <span>{t('financial.addAnother')}</span>
            </button>
          )}
        </>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="financial-entry-form">
          <input
            placeholder={t('financial.descriptionPlaceholder')}
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            autoFocus
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder={t('financial.amountPlaceholder')}
            value={amount}
            onChange={(ev) => setAmount(ev.target.value)}
          />
          <div className="segmented-control">
            <button type="button" className={!isIncome ? 'active' : ''} onClick={() => setIsIncome(false)}>{t('financial.moneyOut')}</button>
            <button type="button" className={isIncome ? 'active' : ''} onClick={() => setIsIncome(true)}>{t('financial.moneyIn')}</button>
          </div>
          <label className="inline">
            <input type="checkbox" checked={isRecurring} onChange={(ev) => setIsRecurring(ev.target.checked)} />
            {t('financial.thisRepeats')}
          </label>
          {isRecurring && (
            <>
              <select value={frequency} onChange={(ev) => setFrequency(ev.target.value)}>
                <option value="daily">{t('financial.everyDay')}</option>
                <option value="weekly">{t('financial.everyWeek')}</option>
                <option value="monthly">{t('financial.everyMonth')}</option>
                <option value="yearly">{t('financial.everyYear')}</option>
              </select>
              <label>
                {t('financial.endsOptional')}
                <input type="date" value={endDate} onChange={(ev) => setEndDate(ev.target.value)} />
              </label>
            </>
          )}
          <div className="form-actions">
            <button type="button" onClick={resetForm}>{t('financial.cancel')}</button>
            <button type="submit" className="button-accent">{t('financial.add')}</button>
          </div>
        </form>
      )}
    </div>
  )
}
