import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../contexts/ToastContext'

export default function JournalEditor({ text, onSave }) {
  const { t } = useTranslation()
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
    showToast(t('journal.toastSaved'))
  }

  return (
    <div className="journal-editor">
      <textarea
        rows={6}
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false) }}
        placeholder={t('journal.placeholder')}
      />
      <button className="button-accent" onClick={handleSave} disabled={saved}>
        {saved ? t('journal.saved') : t('journal.save')}
      </button>
    </div>
  )
}
