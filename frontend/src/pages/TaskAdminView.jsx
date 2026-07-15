import { useEffect, useState } from 'react'
import { Trash2, ListChecks, Plus } from 'lucide-react'
import { del, get, patch, post } from '../api/client'
import EmptyState from '../components/EmptyState'
import { useToast } from '../contexts/ToastContext'

export default function TaskAdminView() {
  const [tasks, setTasks] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const showToast = useToast()

  async function refresh() {
    const data = await get('/task-definitions/')
    setTasks(data.filter((t) => t.is_active))
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    await post('/task-definitions/', { name })
    setName('')
    await refresh()
    showToast('Habit added')
  }

  async function handleRename(id, newName) {
    await patch(`/task-definitions/${id}/`, { name: newName })
    await refresh()
  }

  async function handleDeactivate(id) {
    await del(`/task-definitions/${id}/`)
    await refresh()
    showToast('Removed')
  }

  if (loading) return <p className="loading-text">Loading…</p>

  return (
    <div className="task-admin">
      <h1><ListChecks size={26} /> Your habits &amp; tasks</h1>
      <p className="page-subtitle">These are the things you can check off each day, like brushing your teeth or exercising.</p>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          message="You haven't added any habits yet."
        />
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>
              <input
                defaultValue={t.name}
                onBlur={(e) => e.target.value !== t.name && handleRename(t.id, e.target.value)}
              />
              <button className="icon-button danger" onClick={() => handleDeactivate(t.id)}>
                <Trash2 size={18} />
                <span>Remove</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="task-add-form">
        <input placeholder="e.g. Brush teeth" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="button-accent full-width">
          <Plus size={18} />
          <span>Add habit</span>
        </button>
      </form>
    </div>
  )
}
