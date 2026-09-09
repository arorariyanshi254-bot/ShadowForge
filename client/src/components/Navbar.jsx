import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">
        Shadow<span>Forge</span>
      </NavLink>

      <nav className="navbar-links">
        <NavLink to="/login" className="navbar-link">
          Login
        </NavLink>
        <NavLink to="/register" className="navbar-link navbar-link-cta">
          Register
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
