import { useState } from 'react'

export default function ContextEventsList({ events, onAdd }) {
  const [description, setDescription] = useState('')
  const [opinion, setOpinion] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!description.trim()) return
    onAdd({ description, opinion })
    setDescription('')
    setOpinion('')
  }

  return (
    <div className="context-events">
      <ul>
        {events.map((ev) => (
          <li key={ev.id}>
            <p className="context-description">{ev.description}</p>
            {ev.opinion && <p className="context-opinion">My take: {ev.opinion}</p>}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="context-event-form">
        <input
          placeholder="What happened (world/local news, etc.)?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Your opinion (optional)"
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}
