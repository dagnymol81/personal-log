import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useLogout } from './useLogout';
import {  useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebase/config'
import { getAuth,  reauthenticateWithCredential,  } from 'firebase/auth'


//firebase imports
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const { dispatch } = useAuthContext()

  const login = (email, password) => {
    setError(null)
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        dispatch({ type: 'LOGIN', payload: res.user })
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const { logout } = useLogout()
  const nav = useNavigate()

  const deleteUser = async (user, credential) => {
    const q = query(collection(db, "events"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
    });
    await deleteDoc(doc(db, "users", user.uid))
    await reauthenticateWithCredential(user, credential)
    await user.delete()
    logout()
    nav("/deleted")
   }

  return { error, login, deleteUser }
}