import { useEffect, useState } from 'react'

export default function JournalEditor({ text, onSave }) {
  const [value, setValue] = useState(text)
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    setValue(text)
    setSaved(true)
  }, [text])

  return (
    <div className="journal-editor">
      <textarea
        rows={6}
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false) }}
        placeholder="What happened today?"
      />
      <button onClick={() => { onSave(value); setSaved(true) }} disabled={saved}>
        {saved ? 'Saved' : 'Save'}
      </button>
    </div>
  )
}
