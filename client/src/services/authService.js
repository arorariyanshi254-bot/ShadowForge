const TOKEN_KEY = 'shadowforge_token'
const USER_KEY = 'shadowforge_user'

const API_BASE = '/api/auth'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function isAuthenticated() {
  return !!getToken()
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function handleAuthResponse(data) {
  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token)
  }
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  }
  return data.user
}

export async function register({ name, email, password }) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed')
  }

  return handleAuthResponse(data)
}

export async function login({ email, password }) {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Login failed')
  }

  return handleAuthResponse(data)
}

export async function googleLogin(googlePayload) {
  const response = await fetch(`${API_BASE}/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(googlePayload),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Google authentication failed')
  }

  return handleAuthResponse(data)
}

export async function fetchCurrentUser() {
  const token = getToken()
  if (!token) return null

  try {
    const response = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) {
      logout()
      return null
    }
    const user = await response.json()
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user
  } catch {
    return getCurrentUser()
  }
}
