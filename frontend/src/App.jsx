import React from 'react'
import { Routes ,Route} from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard';

import './App.css'
import AboutUs from './pages/AboutUs/AboutUs';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about-us" element={<AboutUs/>}/>
        <Route path="/dashboard/*" element={<UserDashboard/>}/>

      </Routes>
    </div>
  )
}

export default App
