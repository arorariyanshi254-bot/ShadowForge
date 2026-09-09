import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProjectById, saveFaultConfig } from '../../services/projectService'
import FaultConfigCard from '../../components/FaultConfigCard'

const ERROR_CODES = [400, 401, 403, 404, 429, 500, 503]

const DEFAULT_CONFIG = {
  delay: { enabled: false, ms: 500 },
  error: { enabled: false, code: 500 },
  malformed: { enabled: false },
  rateLimit: { enabled: false, requests: 100, windowSeconds: 60 },
}

function ProjectFaults() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true)
        const p = await getProjectById(id)
        setProject(p)
        if (p?.faultConfig) {
          setConfig({
            delay: { ...DEFAULT_CONFIG.delay, ...p.faultConfig.delay },
            error: { ...DEFAULT_CONFIG.error, ...p.faultConfig.error },
            malformed: { ...DEFAULT_CONFIG.malformed, ...p.faultConfig.malformed },
            rateLimit: { ...DEFAULT_CONFIG.rateLimit, ...p.faultConfig.rateLimit },
          })
        }
      } catch (err) {
        console.error('Error loading project for faults:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  function updateField(section, field, value) {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || DEFAULT_CONFIG[section]),
        [field]: value,
      },
    }))
    setSaved(false)
  }

  async function handleSave() {
    try {
      await saveFaultConfig(id, config)
      setSaved(true)
    } catch (err) {
      alert(err.message || 'Failed to save fault configuration')
    }
  }

  if (loading) return <p>Loading fault settings...</p>
  if (!project) return <p>Project not found.</p>

  return (
    <div className="project-subpage">
      <Link to={`/projects/${id}`} className="back-link">
        &larr; Back to {project.name}
      </Link>

      <h1>Fault Configuration</h1>
      <p className="prototype-note">
        These settings are saved directly into your project's backend database record.
      </p>

      <FaultConfigCard
        title="Delay"
        description="Add artificial latency to mock responses."
        enabled={config.delay.enabled}
        onToggle={(v) => updateField('delay', 'enabled', v)}
      >
        <label className="form-label">
          Delay (ms)
          <input
            type="number"
            min="0"
            value={config.delay.ms}
            onChange={(e) => updateField('delay', 'ms', Number(e.target.value))}
          />
        </label>
      </FaultConfigCard>

      <FaultConfigCard
        title="Error Response"
        description="Return an error status instead of a normal response."
        enabled={config.error.enabled}
        onToggle={(v) => updateField('error', 'enabled', v)}
      >
        <label className="form-label">
          HTTP Status Code
          <select
            value={config.error.code}
            onChange={(e) => updateField('error', 'code', Number(e.target.value))}
          >
            {ERROR_CODES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
      </FaultConfigCard>

      <FaultConfigCard
        title="Malformed Response"
        description="Return a broken or invalid JSON body to test client error handling."
        enabled={config.malformed.enabled}
        onToggle={(v) => updateField('malformed', 'enabled', v)}
      />

      <FaultConfigCard
        title="Rate Limiting"
        description="Cap the number of requests allowed in a time window."
        enabled={config.rateLimit.enabled}
        onToggle={(v) => updateField('rateLimit', 'enabled', v)}
      >
        <label className="form-label">
          Requests Allowed
          <input
            type="number"
            min="1"
            value={config.rateLimit.requests}
            onChange={(e) => updateField('rateLimit', 'requests', Number(e.target.value))}
          />
        </label>
        <label className="form-label">
          Time Window (seconds)
          <input
            type="number"
            min="1"
            value={config.rateLimit.windowSeconds}
            onChange={(e) => updateField('rateLimit', 'windowSeconds', Number(e.target.value))}
          />
        </label>
      </FaultConfigCard>

      <button className="btn btn-primary" onClick={handleSave}>
        Save Fault Settings
      </button>
      {saved && <span className="save-confirmation" style={{ marginLeft: '10px', color: '#10b981' }}>Saved to database!</span>}
    </div>
  )
}

export default ProjectFaults
