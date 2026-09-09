import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProjectById, getSampleSchema, STATUS_STEPS } from '../../services/projectService'
import SchemaTree from '../../components/SchemaTree'

function ProjectSchema() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true)
        const p = await getProjectById(id)
        setProject(p)
      } catch (err) {
        console.error('Failed to load project for schema:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  if (loading) return <p>Loading schema...</p>
  if (!project) return <p>Project not found.</p>

  const schemaReadyIndex = STATUS_STEPS.indexOf('Schema Ready')
  const projectIndex = STATUS_STEPS.indexOf(project.status)
  const schemaAvailable = projectIndex >= schemaReadyIndex

  return (
    <div className="project-subpage">
      <Link to={`/projects/${id}`} className="back-link">
        &larr; Back to {project.name}
      </Link>

      <h1>Inferred Schema</h1>

      {!schemaAvailable ? (
        <div className="empty-state">
          <p>
            Schema inference hasn't run for this project yet. Advance the pipeline to "Schema
            Ready" from the project details page to preview it.
          </p>
        </div>
      ) : (
        <>
          <div className="schema-card">
            <SchemaTree data={getSampleSchema()} />
          </div>
        </>
      )}
    </div>
  )
}

export default ProjectSchema
