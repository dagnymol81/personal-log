import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import { signInWithRedirect } from 'firebase/auth'
import { useGoogleSignup } from '../../hooks/useGoogleSignup'
import { useFacebookSignup } from '../../hooks/useFacebookSignup'
import { FacebookLoginButton } from 'react-social-login-buttons'
import { GoogleLoginButton } from 'react-social-login-buttons'
import { Form, Button } from 'react-bootstrap'

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

      <h3 className="my-3">Or register with email:</h3>

      <Form onSubmit={handleSubmit} className="signup-form">

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email: </Form.Label>
        <Form.Control 
          required
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          value={email}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Password: </Form.Label>
        <Form.Control 
          required
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          value={password}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Repeat Password: </Form.Label>
        <Form.Control 
          required
          type="password"
          name="repeat"
          onChange={(e) => setRepeatPassword(e.target.value)}
          value={repeatPassword}
          className="input"
          placeholder="Repeat your password"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Display Name: </Form.Label>
        <Form.Control 
          required
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
          className="input"
          placeholder="Enter display name"
        />
      </Form.Group>

      <Button variant="secondary" className="my-3">Sign Up</Button>
    </Form>
    {error && <p className="error">{error}</p>} 



    </div>
  )
}