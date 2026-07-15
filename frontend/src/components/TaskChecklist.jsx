import { Check, ListChecks } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import EmptyState from './EmptyState'

export default function TaskChecklist({ taskCompletions, onToggle }) {
  const { t } = useTranslation()
  if (!taskCompletions.length) {
    return (
      <EmptyState
        icon={ListChecks}
        message={t('task.emptyHint')}
      />
    )
  }
  return (
    <ul className="task-checklist">
      {taskCompletions.map((task) => (
        <li key={task.task_definition_id}>
          <button
            type="button"
            className={`task-row${task.completed ? ' done' : ''}`}
            onClick={() => onToggle(task.task_definition_id, !task.completed)}
          >
            <span className="task-check">{task.completed && <Check size={18} strokeWidth={3} />}</span>
            <span className="task-name">{task.name}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
