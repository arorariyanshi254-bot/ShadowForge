import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function ProjectCard({ project, onDelete }) {
  const id = project.id || project._id

  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3>{project.name}</h3>
        <StatusBadge status={project.status} />
      </div>

      <p className="project-card-url">
        {project.method} &middot; {project.targetUrl}
      </p>

      <div className="project-card-actions">
        <Link to={`/projects/${id}`} className="btn btn-secondary">
          View
        </Link>
        {onDelete && (
          <button className="btn btn-danger" onClick={() => onDelete(id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
