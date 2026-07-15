import { Check, ListChecks } from 'lucide-react'
import EmptyState from './EmptyState'

export default function TaskChecklist({ taskCompletions, onToggle }) {
  if (!taskCompletions.length) {
    return (
      <EmptyState
        icon={ListChecks}
        message="No habits added yet. Add your first one in the Tasks tab."
      />
    )
  }
  return (
    <ul className="task-checklist">
      {taskCompletions.map((t) => (
        <li key={t.task_definition_id}>
          <button
            type="button"
            className={`task-row${t.completed ? ' done' : ''}`}
            onClick={() => onToggle(t.task_definition_id, !t.completed)}
          >
            <span className="task-check">{t.completed && <Check size={18} strokeWidth={3} />}</span>
            <span className="task-name">{t.name}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
