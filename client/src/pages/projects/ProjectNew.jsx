import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createProject } from '../../services/projectService'

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

function isValidUrl(value) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function ProjectNew() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [targetUrl, setTargetUrl] = useState('')
  const [method, setMethod] = useState('GET')
  const [headers, setHeaders] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function addHeader() {
    setHeaders([...headers, { key: '', value: '' }])
  }

  function updateHeader(index, field, value) {
    const updated = [...headers]
    updated[index][field] = value
    setHeaders(updated)
  }

  function removeHeader(index) {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Project name is required')
      return
    }

    if (!targetUrl.trim()) {
      setError('Target API URL is required')
      return
    }

    if (!isValidUrl(targetUrl)) {
      setError('Target API URL must be a valid URL, e.g. https://api.example.com/users')
      return
    }

    try {
      setLoading(true)
      const cleanHeaders = headers.filter((h) => h.key.trim() !== '')
      const project = await createProject({ name, targetUrl, method, headers: cleanHeaders })
      const projectId = project.id || project._id
      navigate(`/projects/${projectId}`)
    } catch (err) {
      setError(err.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="project-form-page">
      <Link to="/projects" className="back-link">
        &larr; Back to projects
      </Link>

      <form className="project-form" onSubmit={handleSubmit}>
        <h1>Create Project</h1>

        {error && <p className="form-error">{error}</p>}

        <label className="form-label">
          Project Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Payments API Clone"
            disabled={loading}
          />
        </label>

        <label className="form-label">
          Target API URL
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://api.example.com/v1/users"
            disabled={loading}
          />
        </label>

        <label className="form-label">
          HTTP Method
          <select value={method} onChange={(e) => setMethod(e.target.value)} disabled={loading}>
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <div className="headers-section">
          <div className="headers-header">
            <span className="form-label-text">Request Headers (optional)</span>
            <button type="button" className="btn btn-secondary btn-small" onClick={addHeader} disabled={loading}>
              + Add Header
            </button>
          </div>

          {headers.map((header, index) => (
            <div className="header-row" key={index}>
              <input
                type="text"
                placeholder="Key"
                value={header.key}
                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="header-remove"
                onClick={() => removeHeader(index)}
                aria-label="Remove header"
                disabled={loading}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  )
}

export default ProjectNew
