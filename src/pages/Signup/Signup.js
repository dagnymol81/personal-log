import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import './Signup.css'
import { signInWithRedirect } from 'firebase/auth'
import { useGoogleSignup } from '../../hooks/useGoogleSignup'
import { useFacebookSignup } from '../../hooks/useFacebookSignup'
import { FacebookLoginButton } from 'react-social-login-buttons'
import { GoogleLoginButton } from 'react-social-login-buttons'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  const { error, signup } = useSignup()
  const { auth: gAuth, provider: gProvider } = useGoogleSignup()
  const { auth: fAuth, provider: fProvider } = useFacebookSignup()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password, repeatPassword, displayName)
  }

  return (
    <div className="signup">

      <FacebookLoginButton onClick={() => signInWithRedirect(fAuth, fProvider)} /><br />
      <GoogleLoginButton onClick={() => signInWithRedirect(gAuth, gProvider)} />

      <h3>Or register with email:</h3>

      <form onSubmit={handleSubmit}>

        <label htmlFor="email">email: </label>
          <input
            required
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

        <label htmlFor="password">password: </label>
          <input
            required
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="input"
          />

        <label htmlFor="repeat">
          repeat password: 
        </label>
          <input
            required
            type="password"
            name="repeat"
            onChange={(e) => setRepeatPassword(e.target.value)}
            value={repeatPassword}
            className="input"
          />

        <label htmlFor="display">
          display name:
        </label>
          <input
            required
            type="text"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
            className="input"
          />

        <button className="btn btn-light border">Sign Up</button>
      </form>
      {error && <p className="error">{error}</p>} 



    </div>
  )
}
