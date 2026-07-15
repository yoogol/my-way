import { useEffect, useState } from 'react'
import { useToast } from '../contexts/ToastContext'

export default function JournalEditor({ text, onSave }) {
  const [value, setValue] = useState(text)
  const [saved, setSaved] = useState(true)
  const showToast = useToast()

  useEffect(() => {
    setValue(text)
    setSaved(true)
  }, [text])

  function handleSave() {
    onSave(value)
    setSaved(true)
    showToast('Saved')
  }

  return (
    <div className="journal-editor">
      <textarea
        rows={6}
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false) }}
        placeholder="How was your day? Write as much or as little as you like."
      />
      <button className="button-accent" onClick={handleSave} disabled={saved}>
        {saved ? 'Saved' : 'Save entry'}
      </button>
    </div>
  )
}
