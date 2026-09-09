import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function PublicLayout() {
  return (
    <div className="public-layout">
      <Navbar />
      <main className="public-content">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout
