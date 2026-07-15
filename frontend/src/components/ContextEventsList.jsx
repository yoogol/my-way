import { useState } from 'react'
import { Plus, Newspaper } from 'lucide-react'
import EmptyState from './EmptyState'
import { useToast } from '../contexts/ToastContext'

export default function ContextEventsList({ events, onAdd }) {
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
    showToast('Added')
  }

  return (
    <div className="context-events">
      {events.length === 0 && !showForm ? (
        <EmptyState
          icon={Newspaper}
          message="Nothing noted yet. Add a news story or local event that mattered today."
          actionLabel="+ Add an event"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <>
          <ul>
            {events.map((ev) => (
              <li key={ev.id}>
                <p className="context-description">{ev.description}</p>
                {ev.opinion && <p className="context-opinion">My take: {ev.opinion}</p>}
              </li>
            ))}
          </ul>

          {showForm ? (
            <form onSubmit={handleSubmit} className="context-event-form">
              <input
                placeholder="What happened (world/local news, etc.)?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
              />
              <input
                placeholder="Your opinion (optional)"
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
              />
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="button-accent">Add</button>
              </div>
            </form>
          ) : (
            <button className="add-more-button" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              <span>Add another event</span>
            </button>
          )}
        </>
      )}
    </div>
  )
}
