export default function TaskChecklist({ taskCompletions, onToggle }) {
  if (!taskCompletions.length) {
    return <p className="empty-hint">No tasks yet — add some in Task Admin.</p>
  }
  return (
    <ul className="task-checklist">
      {taskCompletions.map((t) => (
        <li key={t.task_definition_id}>
          <label>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={(e) => onToggle(t.task_definition_id, e.target.checked)}
            />
            {t.name}
          </label>
        </li>
      ))}
    </ul>
  )
}
