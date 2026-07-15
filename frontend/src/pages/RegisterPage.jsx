import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { register } from '../api/client'
import SettingsMenu from '../components/SettingsMenu'

export default function RegisterPage() {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('00:00')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!birthDate) {
      setError(t('auth.birthDateRequired'))
      return
    }
    try {
      await register({
        username,
        email,
        password,
        birth_datetime: `${birthDate}T${birthTime}:00`,
      })
      navigate('/')
    } catch (err) {
      setError(t(err.message, { defaultValue: err.message }))
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-menu-row"><SettingsMenu /></div>
        <h1>{t('app.title')}</h1>
        <p className="tagline-large">{t('app.tagline')}</p>
        <h2>{t('auth.createAccount')}</h2>
        {error && <div className="error">{error}</div>}
        <label>
          {t('auth.username')}
          <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
        </label>
        <label>
          {t('auth.email')}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          {t('auth.password')}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </label>
        <label>
          {t('auth.birthDate')}
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
        </label>
        <p className="field-hint">{t('auth.birthDateHint')}</p>
        <label>
          {t('auth.birthTime')}
          <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
        </label>
        <button type="submit" className="button-accent full-width">
          <UserPlus size={18} />
          <span>{t('auth.createAccountButton')}</span>
        </button>
        <p className="auth-switch">{t('auth.haveAccount')} <Link to="/login">{t('auth.logInLink')}</Link></p>
      </form>
    </div>
  )
}
