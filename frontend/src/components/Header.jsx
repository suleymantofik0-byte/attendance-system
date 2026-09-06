import { useNavigate } from 'react-router-dom'
import { logout } from '../api.js'

// The bar at the top of every dashboard.
function Header({ title, role }) {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <h2>{title}</h2>
      <div className="header-right">
        <span className="role-tag">{role}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </header>
  )
}

export default Header
