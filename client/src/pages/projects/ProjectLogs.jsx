import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProjectById, getRequestLogs } from '../../services/projectService'
import RequestLogTable from '../../components/RequestLogTable'

function ProjectLogs() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [logs, setLogs] = useState([])
  const [methodFilter, setMethodFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true)
        const p = await getProjectById(id)
        setProject(p)
        if (p) {
          setLogs(getRequestLogs(p))
        }
      } catch (err) {
        console.error('Failed to load project logs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadLogs()
  }, [id])

  if (loading) return <p>Loading logs...</p>
  if (!project) return <p>Project not found.</p>

  const filtered = logs.filter((log) => {
    const matchesMethod = methodFilter === 'All' || log.method === methodFilter
    const matchesStatus = statusFilter === 'All' || String(log.statusCode) === statusFilter
    return matchesMethod && matchesStatus
  })

  return (
    <div className="project-subpage">
      <Link to={`/projects/${id}`} className="back-link">
        &larr; Back to {project.name}
      </Link>

      <h1>Request Logs</h1>

      {logs.length === 0 ? (
        <div className="empty-state">
          <p>
            No requests yet. Logs appear here once this project reaches "Mock Ready" and sample
            traffic can be simulated against it.
          </p>
        </div>
      ) : (
        <>
          <div className="projects-filters">
            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
              <option value="All">All methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All statuses</option>
              <option value="200">200</option>
              <option value="201">201</option>
              <option value="400">400</option>
              <option value="404">404</option>
              <option value="500">500</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>No logs match your filters.</p>
            </div>
          ) : (
            <RequestLogTable logs={filtered} />
          )}
        </>
      )}
    </div>
  )
}

export default ProjectLogs
