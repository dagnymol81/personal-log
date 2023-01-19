import { Link } from "react-router-dom";
import './Footer.css'

export default function Footer() {
  return (
    <footer>
      <Link to="/privacy">Privacy Policy</Link>
      <Link to="/terms">Terms and Conditions</Link>
      <Link to="/about">About Personal Log</Link>
    </footer>
  )
}
