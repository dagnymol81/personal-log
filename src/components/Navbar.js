import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useEffect } from 'react';
import { Link } from "react-router-dom";

export default function PLNavbar() {

  const { logout } = useLogout()
  const { user, authIsReady } = useAuthContext()

  useEffect(() => {
    if (user) {
      console.log(user.displayName)
    }
  }, [user])

  return (
    <Navbar bg="light" expand="lg" className="p-3 mb-3 border-bottom">
        <Navbar.Brand href="#home">Personal Log</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav"  className="justify-content-end">
          <Nav>
            {user && <Nav.Link href="/">Home</Nav.Link>}
            {user && <Nav.Link href="/profile">Profile</Nav.Link>}
            {user && <Nav.Link href="#" onClick={logout}>Logout</Nav.Link>}
            {!user && <Nav.Link href="/signup">Signup</Nav.Link>}
            {!user && <Nav.Link href="/login">Login</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}
