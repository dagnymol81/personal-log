// styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// components
import Done from './pages/Done/Done';
import Signup from './pages/Signup/Signup';
import PLNavbar from './components/Navbar';
import Login from './pages/Login/Login';
import Deleted from './pages/Deleted/deleted';
import Privacy from './pages/Privacy/Privacy';
import Footer from './components/Footer';
import Profile from './pages/Profile/Profile';
import Terms from './pages/Terms/Terms';
import About from './pages/About/About';

//modules
import { useAuthContext } from './hooks/useAuthContext';
import { BrowserRouter as Router} from 'react-router-dom'
import { Routes, Route, Navigate, } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc,} from "firebase/firestore";
import { db } from './firebase/config'

function App() {

  const [theme, setTheme] = useState(null)
  const { user } = useAuthContext()
  const [darkModeChecked, setDarkModeChecked] = useState(false)

  useEffect(() => {
    if (user) {
      async function fetchUserDoc()  {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          let userData = docSnap.data()
          setTheme(userData.theme)
          if (theme === 'light') {
            setDarkModeChecked(false)
          } else if (theme === 'dark') {
            setDarkModeChecked(true)
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }
      fetchUserDoc()
    }
  }, [user])

  const toggleTheme = async (e) => {
    const userRef = doc(db, "users", user.uid)
    if (e.target.checked) {
      setTheme('dark');
      setDarkModeChecked(true)
      await updateDoc(userRef, {
      theme: 'dark'
        });
      } else {
      setTheme('light');
      setDarkModeChecked(false)
      await updateDoc(userRef, {
      theme: 'light'
    });
    }
    };

    useEffect(() => {
      document.body.className = theme
    }, [theme])

    useEffect(() => {
      if (user) {
    
        if (user.theme === 'light') {
          console.log('light')
          setTheme('light')
        } else if (user.theme === 'dark') {
          console.log('dark')
          setTheme('dark')
        }
      }
    }, [user])

  return (
 
    <div className={`App ${theme}`}>

      <Router>
    
      <PLNavbar />
        <Routes>

          <Route 
            path="/signup" 
            element={
              user ?
              <Navigate replace to="/" /> :
              <Signup />
            }/>

          <Route 
            path="/login" 
            element={
              user ?
              <Navigate replace to="/" /> :
              <Login />
          }/>

          <Route 
            path="/privacy" 
            element={
              <Privacy />
          }/>

        <Route 
            path="/terms" 
            element={
              <Terms />
          }/>

        <Route 
            path="/about" 
            element={
              <About />
          }/>

          <Route 
            path="/deleted" 
            element={
              <Deleted />
          }/>

          <Route 
            path="/profile"
            element={
              user ?
              <Profile 
              /> 
              :
              <Navigate replace to="/signup" />
            }
          />

          <Route path="/"
            element={
              user ?
              <Done /> :
              <Navigate replace to="/login" />
            } />

        </Routes>
        <Footer />

        </Router>
      
    </div>
   
  )}


export default App;
