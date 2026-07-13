const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8002/api'

const ACCESS_KEY = 'my_way_access'
const REFRESH_KEY = 'my_way_refresh'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function isAuthenticated() {
  return !!getAccessToken()
}

function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

async function refreshAccessToken() {
  const refresh = localStorage.getItem(REFRESH_KEY)
  if (!refresh) return false
  const res = await fetch(`${API}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })
  if (!res.ok) return false
  const data = await res.json()
  setTokens({ access: data.access })
  return true
}

async function apiFetch(path, opts = {}, retried = false) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
  const access = getAccessToken()
  if (access) headers['Authorization'] = `Bearer ${access}`

  const res = await fetch(`${API}${path}`, { ...opts, headers })

  if (res.status === 401 && !retried) {
    const refreshed = await refreshAccessToken()
    if (refreshed) return apiFetch(path, opts, true)
    clearTokens()
    window.location.href = '/login'
    throw new Error('Session expired')
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export const get = (path) => apiFetch(path)
export const post = (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) })
export const patch = (path, body) => apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) })
export const del = (path) => apiFetch(path, { method: 'DELETE' })

export async function login(username, password) {
  const res = await fetch(`${API}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Invalid username or password')
  const data = await res.json()
  setTokens(data)
  return data
}

export async function register(payload) {
  const res = await fetch(`${API}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Registration failed')
  }
  const data = await res.json()
  setTokens(data)
  return data
}

export function logout() {
  clearTokens()
}
