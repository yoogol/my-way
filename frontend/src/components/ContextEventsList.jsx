import { useState } from 'react'
import { Plus, Newspaper } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import EmptyState from './EmptyState'
import { useToast } from '../contexts/ToastContext'

export default function ContextEventsList({ events, onAdd }) {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [description, setDescription] = useState('')
  const [opinion, setOpinion] = useState('')
  const showToast = useToast()

  function handleSubmit(e) {
    e.preventDefault()
    if (!description.trim()) return
    onAdd({ description, opinion })
    setDescription('')
    setOpinion('')
    setShowForm(false)
    showToast(t('context.toastAdded'))
  }

  return (
    <div className="context-events">
      {events.length === 0 && !showForm ? (
        <EmptyState
          icon={Newspaper}
          message={t('context.emptyHint')}
          actionLabel={t('context.addEvent')}
          onAction={() => setShowForm(true)}
        />
      ) : (
        <>
          <ul>
            {events.map((ev) => (
              <li key={ev.id}>
                <p className="context-description">{ev.description}</p>
                {ev.opinion && <p className="context-opinion">{t('context.myTake')} {ev.opinion}</p>}
              </li>
            ))}
          </ul>

          {showForm ? (
            <form onSubmit={handleSubmit} className="context-event-form">
              <input
                placeholder={t('context.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
              />
              <input
                placeholder={t('context.opinionPlaceholder')}
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
              />
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>{t('context.cancel')}</button>
                <button type="submit" className="button-accent">{t('context.add')}</button>
              </div>
            </form>
          ) : (
            <button className="add-more-button" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              <span>{t('context.addAnother')}</span>
            </button>
          )}
        </>
      )}
    </div>
  )
}
