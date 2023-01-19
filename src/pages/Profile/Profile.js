import { getAuth,  EmailAuthProvider,  signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import {  useState } from "react";
import { useLogin } from "../../hooks/useLogin";

export default function Profile() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [credential, setCredential] = useState(null)

  const { deleteUser } = useLogin()

  const auth = getAuth();
  const user = auth.currentUser

  const handleSubmit = async (e) => {
    e.preventDefault()
    const credential = EmailAuthProvider.credential(
      email,
      password
    )
    await setCredential(credential)
    deleteUser(user, credential)
  }

  let pwAccount, googleAccount, facebookAccount = false
  if (user.providerData[0].providerId === "password") {
    pwAccount = true
  } else if (user.providerData[0].providerId === "google.com") {
    googleAccount = true
  } else if (user.providerData[0].providerId === "facebook.com") {
    facebookAccount = true
  }
  
  const deleteGoogleLoginAccount =  () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        deleteUser(user, credential)
      })   
  }

  const deleteFacebookLoginAccount = () => {
    const provider = new FacebookAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = FacebookAuthProvider.credentialFromResult(result);
        deleteUser(user, credential)
      })
  }

  return (
    <div>

<div className="modal" data-bs-backdrop="false" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body">
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
        <button className="btn btn-light border">Delete Account</button>
        {error && <p className="error">{error}</p>}
      </form>

      </div>
    </div>
  </div>
</div>
<h2>Profile</h2>
<p>
<strong>Name: </strong> {user.displayName}<br />
<strong>Email: </strong> {user.email}<br />
<strong>Logged in with:</strong>  {user.providerData[0].providerId}<br />
<strong>Account Created:</strong>  {user.metadata.creationTime}
</p>
    {pwAccount && 
      <p className="warning" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Delete my account<br />
      This will delete your account and all data. This action cannot be undone.
      </p>
  }
  {googleAccount && 
  <p className="warning" onClick={() => deleteGoogleLoginAccount()}>
    Delete my account. This will delete all your data on Personal Log, including login credentials. This action cannot be undone.
  </p>
  }
  {facebookAccount && 
  <p className="warning" onClick={() => deleteFacebookLoginAccount()}>
    Delete my account. This will delete all your data on Personal Log, including login credentials. This action cannot be undone.
  </p>
  }
    </div>
  )
}
