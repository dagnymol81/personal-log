import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/config'
import { getAuth,  EmailAuthProvider, reauthenticateWithCredential, } from 'firebase/auth'
import { redirect, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import de from "date-fns/esm/locale/de/index.js";


export default function Profile() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [credential, setCredential] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const credential = EmailAuthProvider.credential(
      email,
      password
    )
    await setCredential(credential)
    deleteUser()
  }

  const nav = useNavigate()

  const auth = getAuth();
  const user = auth.currentUser

  const deleteUser = async () => {
    const q = query(collection(db, "events"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
    });
    await deleteDoc(doc(db, "users", user.uid))
    await reauthenticateWithCredential(user, credential)
    await user.delete()
    nav("/privacy")
   }
  

  return (
    <div>

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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

      <p data-bs-toggle="modal" data-bs-target="#exampleModal">
      Delete my account<br />
      This will delete your account and all data. This action cannot be undone.
      </p>
    </div>
  )
}
