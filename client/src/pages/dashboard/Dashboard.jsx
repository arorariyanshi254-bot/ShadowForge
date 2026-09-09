import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../../services/authService'
import { getProjects, getProjectStats } from '../../services/projectService'
import StatCard from '../../components/StatCard'
import ProjectCard from '../../components/ProjectCard'

function Dashboard() {
  const user = getCurrentUser()
  const [stats, setStats] = useState(null)
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, projectsData] = await Promise.all([
          getProjectStats(),
          getProjects(),
        ])
        setStats(statsData)
        setRecentProjects(projectsData.slice(0, 3))
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome{user ? `, ${user.name}` : ''}</h1>
          <p>Here's what's happening across your ShadowForge projects.</p>
        </div>
        <Link to="/projects/new" className="btn btn-primary">
          + Create Project
        </Link>
      </div>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          {stats && (
            <div className="stats-grid">
              <StatCard label="Total Projects" value={stats.totalProjects} />
              <StatCard label="Active Mocks" value={stats.activeMocks} />
              <StatCard label="Total Requests" value={stats.totalRequests} />
              <StatCard label="Failed Requests" value={stats.failedRequests} />
            </div>
          )}

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Recent Projects</h2>
              <Link to="/projects">View all</Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any projects yet.</p>
                <Link to="/projects/new" className="btn btn-primary">
                  Create your first project
                </Link>
              </div>
            ) : (
              <div className="project-grid">
                {recentProjects.map((project) => (
                  <ProjectCard key={project.id || project._id} project={project} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Dashboard
