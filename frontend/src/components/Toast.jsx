import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function Toast({ toasts }) {
  if (!toasts.length) return null
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.variant}`}>
          {t.variant === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
