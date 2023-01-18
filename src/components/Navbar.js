import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

import './Navbar.css'
import { useEffect } from "react";

export default function Navbar() {

  const { logout } = useLogout()
  const { user, authIsReady } = useAuthContext()

  useEffect(() => {
    if (user) {
      console.log(user.displayName)
    }
  }, [user])

  return (
    <nav className="navbar bg-light border-bottom p-0">
      {user && <h2>Hi {user.displayName}</h2>}
      <ul className="nav">
        {user && <li className="nav-item"><Link to="/">Home</Link></li>}
        {!user && <li className="nav-item"><Link to="/signup">Signup</Link></li>}
        {!user && <li className="nav-item"><Link to="/login">Login</Link></li>}
        {user && <li className="nav-item"><Link to="/profile">Profile</Link></li>}
        {user && <li className="nav-item" onClick={logout}><strong>Logout</strong></li>}
      </ul>
    </nav>
  )
}
