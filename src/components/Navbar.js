import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

import './Navbar.css'

export default function Navbar() {

  const { logout } = useLogout()
  const { user, authIsReady } = useAuthContext()

  return (
    <nav className="navbar bg-light border-bottom mb-3 p-3">
      <ul className="nav">
        {user && <li className="nav-item"><Link to="/">Home</Link></li>}
        {!user && <li className="nav-item"><Link to="/signup">Signup</Link></li>}
        {!user && <li className="nav-item"><Link to="/login">Login</Link></li>}
        {user && <li className="nav-item" onClick={logout}><strong>Logout</strong></li>}
      </ul>
    </nav>
  )
}
