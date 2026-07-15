export default function EmptyState({ icon: Icon, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={32} className="empty-state-icon" />}
      <p>{message}</p>
      {actionLabel && onAction && (
        <button className="button-accent" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  )
}
