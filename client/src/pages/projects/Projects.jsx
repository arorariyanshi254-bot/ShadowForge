import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects, deleteProject } from '../../services/projectService'
import ProjectCard from '../../components/ProjectCard'

function Projects() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  async function fetchProjects() {
    try {
      setLoading(true)
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this project? This cannot be undone.')
    if (!confirmed) return

    try {
      await deleteProject(id)
      await fetchProjects()
    } catch (err) {
      alert(err.message || 'Failed to delete project')
    }
  }

  const filtered = projects.filter((p) => {
    const term = search.toLowerCase()
    const matchesSearch =
      (p.name || '').toLowerCase().includes(term) || (p.targetUrl || '').toLowerCase().includes(term)
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="projects-page">
      <div className="dashboard-header">
        <h1>Projects</h1>
        <Link to="/projects/new" className="btn btn-primary">
          + New Project
        </Link>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <>
          {projects.length > 0 && (
            <div className="projects-filters">
              <input
                type="text"
                placeholder="Search by name or URL"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="projects-search"
              />

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All statuses</option>
                <option value="Configured">Configured</option>
                <option value="Captured">Captured</option>
                <option value="Schema Ready">Schema Ready</option>
                <option value="Mock Ready">Mock Ready</option>
                <option value="Active">Active</option>
              </select>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any projects yet.</p>
              <Link to="/projects/new" className="btn btn-primary">
                Create your first project
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>No projects match your search.</p>
            </div>
          ) : (
            <div className="project-grid">
              {filtered.map((project) => (
                <ProjectCard key={project.id || project._id} project={project} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Projects
