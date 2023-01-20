import { getAuth, getRedirectResult, FacebookAuthProvider } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
 

export const useFacebookSignup = () => {

  const auth = getAuth();

  const provider = new FacebookAuthProvider();

  getRedirectResult(auth)
  .then((result) => {
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user)
    setDoc(doc(db, 'users', user.uid), {
          displayName: user.displayName,
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
  }
  ).catch((error) => {
    console.log(error.message)
  });

  return { auth, provider }

}
