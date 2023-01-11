import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { error, login } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">email: </label>
          <input
            required
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        <label htmlFor="password">password: </label>
          <input
            required
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        <button className="btn btn-light border">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
