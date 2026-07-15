import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Settings, LogOut, Check } from 'lucide-react'

export default function SettingsMenu({ onLogout }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectLanguage(lang) {
    i18n.changeLanguage(lang)
    setOpen(false)
  }

  const currentFlag = i18n.language === 'ru' ? '🇷🇺' : '🇺🇸'

  return (
    <div className="settings-menu" ref={ref}>
      <button className="settings-menu-trigger" onClick={() => setOpen((o) => !o)}>
        <Settings size={18} />
        <span>{currentFlag} {t('common.menu')}</span>
      </button>
      {open && (
        <div className="settings-menu-panel">
          <button className="menu-item" onClick={() => selectLanguage('en')}>
            <span>🇺🇸 English</span>
            {i18n.language === 'en' && <Check size={16} />}
          </button>
          <button className="menu-item" onClick={() => selectLanguage('ru')}>
            <span>🇷🇺 Русский</span>
            {i18n.language === 'ru' && <Check size={16} />}
          </button>
          {onLogout && (
            <>
              <div className="menu-divider" />
              <button className="menu-item" onClick={onLogout}>
                <LogOut size={16} />
                <span>{t('topbar.logout')}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
