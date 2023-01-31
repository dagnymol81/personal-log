import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { signInWithRedirect } from 'firebase/auth'
import { useGoogleSignup } from '../../hooks/useGoogleSignup'
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons'
import { useFacebookSignup } from '../../hooks/useFacebookSignup'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { error, login } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  const { auth: gAuth, provider: gProvider } = useGoogleSignup()
  const { auth: fAuth, provider: fProvider } = useFacebookSignup()
  
  return (
    <div className="signup">
      <FacebookLoginButton onClick={() => signInWithRedirect(fAuth, fProvider)} /><br />
      <GoogleLoginButton onClick={() => signInWithRedirect(gAuth, gProvider)} />

    <h2>Or login to your account:</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">email: </label>
          <input
            required
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="form-control my-3"
          />
        <label htmlFor="password">password: </label>
          <input
            required
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="form-control my-3"
          />
        <button className="btn btn-light border">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
