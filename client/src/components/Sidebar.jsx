import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleLinkClick() {
    // Collapse the mobile sidebar as soon as a link is used.
    if (onClose) onClose()
  }

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            Shadow<span>Forge</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className="sidebar-link" onClick={handleLinkClick}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" className="sidebar-link" onClick={handleLinkClick}>
            Projects
          </NavLink>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          Log out
        </button>
      </aside>
    </>
  )
}

export default Sidebar
