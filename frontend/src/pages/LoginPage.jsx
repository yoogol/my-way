import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { login } from '../api/client'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function LoginPage() {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(t(err.message, { defaultValue: err.message }))
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <LanguageSwitcher />
        <h1>{t('app.title')}</h1>
        <p className="tagline-large">{t('app.tagline')}</p>
        <h2>{t('auth.welcomeBack')}</h2>
        {error && <div className="error">{error}</div>}
        <label>
          {t('auth.username')}
          <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
        </label>
        <label>
          {t('auth.password')}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" className="button-accent full-width">
          <LogIn size={18} />
          <span>{t('auth.logIn')}</span>
        </button>
        <p className="auth-switch">{t('auth.noAccount')} <Link to="/register">{t('auth.createOne')}</Link></p>
      </form>
    </div>
  )
}
