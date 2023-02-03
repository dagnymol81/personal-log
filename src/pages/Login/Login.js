import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { signInWithRedirect } from 'firebase/auth'
import { useGoogleSignup } from '../../hooks/useGoogleSignup'
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons'
import { useFacebookSignup } from '../../hooks/useFacebookSignup'
import { Form, Button } from 'react-bootstrap'

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

    <h2 className="my-3 py-3">Or login to your account:</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email: </Form.Label>
          <Form.Control 
            required
            name="email"
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Password: </Form.Label>
          <Form.Control 
            required
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            value={password}
          />
        </Form.Group>

        <Button variant="secondary">
          Login
        </Button>

        {error && <p className="error">{error}</p>}
      </Form>

    </div>
  )
}
