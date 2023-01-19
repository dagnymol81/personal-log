import './App.css';
import { Routes, Route, Navigate, } from 'react-router-dom'
import Done from './pages/Done/Done';
import Signup from './pages/Signup/Signup';
import Navbar from './components/Navbar';
import Login from './pages/Login/Login';
import Deleted from './pages/Deleted/deleted';
import { useAuthContext } from './hooks/useAuthContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import Privacy from './pages/Privacy/Privacy';
import Footer from './components/Footer';
import Profile from './pages/Profile/Profile';
import Terms from './pages/Terms/Terms';
import About from './pages/About/About';

function App() {
  const { user, authIsReady } = useAuthContext()

  return (
    <div className="App dark">
      <Navbar />
      <div className="container">

        <Routes>

          <Route 
            path="/" 
            element={
              user ?
              <Done /> :
              <Navigate replace to="/login" />
            }/>

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
              <Profile /> :
              <Navigate replace to="/signup" />
            }
          />

        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
