import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Projects from './pages/projects/Projects'
import ProjectNew from './pages/projects/ProjectNew'
import ProjectDetails from './pages/projects/ProjectDetails'
import ProjectSchema from './pages/projects/ProjectSchema'
import ProjectFaults from './pages/projects/ProjectFaults'
import ProjectLogs from './pages/projects/ProjectLogs'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<ProjectNew />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/:id/schema" element={<ProjectSchema />} />
          <Route path="/projects/:id/faults" element={<ProjectFaults />} />
          <Route path="/projects/:id/logs" element={<ProjectLogs />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
