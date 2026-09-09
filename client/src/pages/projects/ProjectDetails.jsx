import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProjectById, updateProject, STATUS_STEPS } from '../../services/projectService'
import StatusBadge from '../../components/StatusBadge'
import PipelineStatus from '../../components/PipelineStatus'

function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true)
        const data = await getProjectById(id)
        setProject(data)
      } catch (err) {
        console.error('Failed to load project details:', err)
        setProject(null)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  if (loading) {
    return <p>Loading project details...</p>
  }

  if (!project) {
    return (
      <div className="empty-state">
        <p>This project doesn't exist or was deleted.</p>
        <Link to="/projects" className="btn btn-primary">
          Back to projects
        </Link>
      </div>
    )
  }

  const currentIndex = STATUS_STEPS.indexOf(project.status)
  const nextStatus = STATUS_STEPS[currentIndex + 1]

  async function advanceStage() {
    try {
      const updated = await updateProject(project.id || project._id, { status: nextStatus })
      setProject(updated)
    } catch (err) {
      alert(err.message || 'Failed to advance stage')
    }
  }

  const projectId = project.id || project._id

  return (
    <div className="project-details-page">
      <Link to="/projects" className="back-link">
        &larr; Back to projects
      </Link>

      <div className="project-details-header">
        <div>
          <h1>{project.name}</h1>
          <p className="project-details-url">
            {project.method} &middot; {project.targetUrl}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <span>Created</span>
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        {project.status === 'Active' && (
          <div className="detail-row">
            <span>Mock URL</span>
            <span className="mock-url">https://mock.shadowforge.dev/{projectId}</span>
          </div>
        )}
      </div>

      <section className="dashboard-section">
        <h2>Pipeline Progress</h2>
        <PipelineStatus status={project.status} />

        {nextStatus && (
          <button className="btn btn-secondary" onClick={advanceStage}>
            Simulate: advance to "{nextStatus}"
          </button>
        )}
        <p className="pipeline-note">
          This pipeline connects to your ShadowForge backend database.
        </p>
      </section>

      <section className="dashboard-section">
        <h2>Project Tools</h2>
        <div className="project-tools">
          <button className="btn btn-secondary" onClick={() => navigate(`/projects/${id}/schema`)}>
            View Schema
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(`/projects/${id}/faults`)}>
            Configure Faults
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(`/projects/${id}/logs`)}>
            Request Logs
          </button>
        </div>
      </section>
    </div>
  )
}

export default ProjectDetails
