import { getAuth,  EmailAuthProvider,  signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import {  useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../firebase/config'

import './Profile.css'
import Feedback from './Feedback';

import {  Button, Modal, Form } from 'react-bootstrap';

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

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [fbShow, setfbShow] = useState(false);
  const handlefbClose = () => setfbShow(false);
  const handlefbShow = () => setfbShow(true);


  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete your account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>
          This will delete your account, including all your data.
        </p>
      <Form>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            required
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            required
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Form.Group>
        <Button variant="outline-danger me-3" onClick={handleSubmit}>Delete Account</Button>
        <Button variant="outline-dark" onClick={handleClose}>Cancel</Button>
        {error && <p className="error">{error}</p>}
      </Form>
        </Modal.Body>
      </Modal>

<Modal show={fbShow} onHide={handlefbClose}>
  <Modal.Dialog>
    <Modal.Header closeButton>
      <Modal.Title>Delete your account</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        This will delete your account, including all your data. This cannot be reversed.
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="danger" onClick={() => deleteFacebookLoginAccount()}>Delete my account</Button>
      <Button variant="secondary" onClick={handlefbClose}>Cancel</Button>
    </Modal.Footer>
  </Modal.Dialog>
</Modal>

<h2>Profile</h2>
<p>
  <strong>Name: </strong> {user.displayName}<br />
  <strong>Email: </strong> {user.email}<br />
  <strong>Logged in with:</strong>  {user.providerData[0].providerId}<br />
  <strong>Account Created:</strong>  {user.metadata.creationTime}
</p>

<h2>Preferences</h2>

<Form.Check 
  type="switch"
  id="darkModeSwitch"
  label="Dark Mode"
  onClick={(e) => toggleTheme(e) }
/>

<br />
<Feedback user={user} />
<h2>Export User Data</h2>

<Button variant="secondary my-3" onClick={exportData}>Export my user data (JSON)</Button>

<h2>Delete Your Account</h2>
    {pwAccount && 
      <>
        <Button variant="danger my-3 me-3" onClick={handleShow}>Delete My Account</Button>
        This will delete your account and all data. This action cannot be undone.
      </>


  }
  {googleAccount && 
  <>
    <Button variant="danger my-3 me-3" onClick={() => deleteGoogleLoginAccount()}>Delete Account</Button>
    Delete my account. This will delete all your data on Personal Log, including login credentials. This action cannot be undone.
  </>


  }
  {facebookAccount && 
  <>
    <Button variant="danger my-3 me-3" onClick={handlefbShow}>Delete Account</Button>
    Delete my account. This will delete all your data on Personal Log, including login credentials. This action cannot be undone.
  </>
  }

  </div>
)}
