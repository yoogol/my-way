import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { register } from '../api/client'

export default function RegisterPage() {
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
      setError('Birth date is required')
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
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>My Way</h1>
        <p className="tagline-large">because every day matters</p>
        <h2>Create your account</h2>
        {error && <div className="error">{error}</div>}
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
        </label>
        <label>
          Email (optional)
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </label>
        <label>
          Your birth date
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
        </label>
        <p className="field-hint">We use this to show how long you've been alive on your home screen — just a bit of fun.</p>
        <label>
          Birth time (optional)
          <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
        </label>
        <button type="submit" className="button-accent full-width">
          <UserPlus size={18} />
          <span>Create account</span>
        </button>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  )
}
