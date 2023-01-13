import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import './Signup.css'
import { signInWithRedirect } from 'firebase/auth'
import { useGoogleSignup } from '../../hooks/useGoogleSignup'
import google_signin from '../../google_signin.png'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  const { error, signup } = useSignup()
  const { auth, provider } = useGoogleSignup()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password, repeatPassword, displayName)
  }

  return (
    <div>
      <h2>Register</h2>

      <img src={google_signin} alt="Sign In With Google" onClick={() => signInWithRedirect(auth, provider)} />

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
