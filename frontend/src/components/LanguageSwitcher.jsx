import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div className="segmented-control language-switcher">
      <button
        type="button"
        className={i18n.language === 'en' ? 'active' : ''}
        onClick={() => i18n.changeLanguage('en')}
      >
        🇺🇸 EN
      </button>
      <button
        type="button"
        className={i18n.language === 'ru' ? 'active' : ''}
        onClick={() => i18n.changeLanguage('ru')}
      >
        🇷🇺 RU
      </button>
    </div>
  )
}
