import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { login, googleLogin } from '../../services/authService'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in both fields')
      return
    }

    try {
      setLoading(true)
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    try {
      setLoading(true)
      await googleLogin({ credential: credentialResponse.credential })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Google Sign-In failed')
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleError() {
    setError('Google Sign-In was unsuccessful or closed.')
  }

  // Fallback demo Google login for quick testing without real Client ID setup
  async function handleDemoGoogleLogin() {
    try {
      setLoading(true)
      await googleLogin({
        email: 'user.demo@gmail.com',
        name: 'Demo Google User',
        picture: 'https://lh3.googleusercontent.com/a/default-user',
        sub: 'google-demo-12345'
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Log in</h1>

        {error && <p className="form-error">{error}</p>}

        <label className="form-label">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
          />
        </label>

        <label className="form-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <div className="auth-divider" style={{ margin: '20px 0', textAlign: 'center', color: '#888', position: 'relative' }}>
          <span>OR</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            width="100%"
          />

          <button
            type="button"
            onClick={handleDemoGoogleLogin}
            className="btn btn-secondary btn-block"
            style={{ fontSize: '13px', background: '#334155', color: '#fff' }}
          >
            🔍 Test Google Sign-In (Instant Demo)
          </button>
        </div>

        <p className="auth-switch" style={{ marginTop: '20px' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
