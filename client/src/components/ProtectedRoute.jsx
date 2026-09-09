import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../services/authService'

// Guards any nested routes behind a login check.
// If there's no active session, send the user to /login instead.
function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
