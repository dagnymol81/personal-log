import { getAuth,  getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
 
export const useGoogleSignup = () => {

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  getRedirectResult(auth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
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
        }, { merge: true })
  }
  ).catch((error) => {
    console.log(error.message)
  });

  return { auth, provider }

}
