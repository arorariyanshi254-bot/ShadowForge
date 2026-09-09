import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { register, googleLogin } from '../../services/authService'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await register({ name, email, password })
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
    setError('Google Sign-In was unsuccessful.')
  }

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
        <h1>Create an account</h1>

        {error && <p className="form-error">{error}</p>}

        <label className="form-label">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            disabled={loading}
          />
        </label>

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
            placeholder="At least 6 characters"
            disabled={loading}
          />
        </label>

        <label className="form-label">
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <div className="auth-divider" style={{ margin: '20px 0', textAlign: 'center', color: '#888' }}>
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
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
