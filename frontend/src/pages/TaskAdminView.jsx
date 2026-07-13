import { useEffect, useState } from 'react'
import { del, get, patch, post } from '../api/client'

export default function TaskAdminView() {
  const [tasks, setTasks] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

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
  }

  async function handleRename(id, newName) {
    await patch(`/task-definitions/${id}/`, { name: newName })
    await refresh()
  }

  async function handleDeactivate(id) {
    await del(`/task-definitions/${id}/`)
    await refresh()
  }

  if (loading) return <p>Loading…</p>

  return (
    <div className="task-admin">
      <h1>Your habits &amp; tasks</h1>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <input
              defaultValue={t.name}
              onBlur={(e) => e.target.value !== t.name && handleRename(t.id, e.target.value)}
            />
            <button onClick={() => handleDeactivate(t.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd}>
        <input placeholder="e.g. brush teeth" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}
