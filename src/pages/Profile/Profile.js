import { getAuth,  EmailAuthProvider,  signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import {  useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useCollection } from '../../hooks/useCollection';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../firebase/config'

import './Profile.css'
import Feedback from './Feedback';

export default function Profile({ toggleTheme, darkModeChecked }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [credential, setCredential] = useState(null)

  const { deleteUser } = useLogin()

  const auth = getAuth();
  const user = auth.currentUser

  const exportData = async () => {
    const q = query(collection(db, "events"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const userData = []
    querySnapshot.forEach((doc) => {
      userData.push(doc.data())
    });
    const fileData = JSON.stringify(userData)
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "user-info.json";
    link.href = url;
    link.click();
  }

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

{/* password account deletion modal */}
<div className="modal" data-bs-backdrop="false" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body">
        <p>
          This will delete your account, including all your data.
        </p>
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
        <button type="button" className="btn btn-light border" data-bs-dismiss="modal">Cancel</button>
        {error && <p className="error">{error}</p>}
      </form>
      </div>
    </div>
  </div>
</div>

{/* facebook account deletion modal */}
<div className="modal" data-bs-backdrop="false" id="fbModal" tabIndex="-1" aria-labelledby="fbModal" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body">
        <p>
        This will delete your account, including all your data. This cannot be reversed.
        </p>

        <button className="btn btn-light border m-3" onClick={() => deleteFacebookLoginAccount()}>Delete my account</button>
        <button type="button" className="btn btn-light border m-3" data-bs-dismiss="modal">Cancel</button>
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

<h2>Preferences</h2>

<p className="form-check form-switch">
  <input className="form-check-input" type="checkbox" role="switch" id="darkModeSwitch" checked={darkModeChecked} onClick={(e) => toggleTheme(e) }/>
  <label className="form-check-label" htmlFor="darkModeSwitch">Dark Mode</label>
</p>
<br />
<Feedback user={user} />
<h2>Export User Data</h2>
<button className="btn btn-light border mb-3" onClick={() => exportData()}>Export my user data (JSON format)</button>
<h2>Delete Your Account</h2>
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
  <p className="warning" data-bs-toggle="modal" data-bs-target="#fbModal">
    Delete my account. This will delete all your data on Personal Log, including login credentials. This action cannot be undone.
  </p>
  }
    </div>
  )
}
