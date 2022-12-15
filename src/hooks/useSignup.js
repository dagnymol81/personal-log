import {  createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { auth, db } from '../firebase/config'

 
export const useSignup = () => {
  const [error, setError] = useState(null)
  const { dispatch } = useAuthContext()
 
  const signup = async (email, password, displayName) => {

    setError(null)

    const res = await createUserWithEmailAndPassword(auth, email, password)

    if (!res) {
      throw new Error('Could not complete signup')
    }
    
    await updateProfile(auth.currentUser, {
      displayName
    })

    // create a user document
    await setDoc(doc(db, 'users', res.user.uid), {
      displayName,
      tags:    [ {
        value: 'health', 
        label: 'health'
      },
      {
        value: 'work',
        label: 'work'
      },
      {
        value: 'home',
        label: 'home'
      }]
    } )
  

     // dispatch login action
     dispatch({ type: 'LOGIN', payload: res.user })
}

return { error, signup }

}