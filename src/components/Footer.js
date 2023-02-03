import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <Link to="/privacy">Privacy Policy</Link>
      <Link to="/terms">Terms and Conditions</Link>
      <Link to="/about">About Us</Link>
    </footer>
  )
}
