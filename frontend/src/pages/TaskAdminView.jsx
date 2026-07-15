import { useEffect, useState } from 'react'
import { Trash2, ListChecks, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { del, get, patch, post } from '../api/client'
import EmptyState from '../components/EmptyState'
import { useToast } from '../contexts/ToastContext'

export default function TaskAdminView() {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const showToast = useToast()

  async function refresh() {
    const data = await get('/task-definitions/')
    setTasks(data.filter((task) => task.is_active))
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
    showToast(t('task.toastAdded'))
  }

  async function handleRename(id, newName) {
    await patch(`/task-definitions/${id}/`, { name: newName })
    await refresh()
  }

  async function handleDeactivate(id) {
    await del(`/task-definitions/${id}/`)
    await refresh()
    showToast(t('task.toastRemoved'))
  }

  if (loading) return <p className="loading-text">{t('common.loading')}</p>

  return (
    <div className="task-admin">
      <h1><ListChecks size={26} /> {t('task.adminTitle')}</h1>
      <p className="page-subtitle">{t('task.adminSubtitle')}</p>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          message={t('task.adminEmptyHint')}
        />
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <input
                defaultValue={task.name}
                onBlur={(e) => e.target.value !== task.name && handleRename(task.id, e.target.value)}
              />
              <button className="icon-button danger" onClick={() => handleDeactivate(task.id)}>
                <Trash2 size={18} />
                <span>{t('task.remove')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="task-add-form">
        <input placeholder={t('task.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="button-accent full-width">
          <Plus size={18} />
          <span>{t('task.addHabit')}</span>
        </button>
      </form>
    </div>
  )
}
