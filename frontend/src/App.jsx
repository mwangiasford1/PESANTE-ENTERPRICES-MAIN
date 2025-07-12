import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Appointment from './components/Appointment';
import Properties from './components/Properties';
import AdminPortal from './components/AdminPortal';
import { PropertiesProvider } from './components/PropertiesContext';
import Login from './components/Login';
import React, { useState } from 'react';
import Footer from './components/Footer';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={open ? 'open' : ''} onClick={() => setOpen(false)}>
        <li><Link to="/">Home</Link></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><Link to="/properties">Properties</Link></li>
        <li><Link to="/appointment">Appointment</Link></li>
        {/* <li><Link to="/admin">Admin Portal</Link></li> */}
      </ul>
    </nav>
  );
};

const Home = () => (
  <>
    <Hero />
    <Services />
    <About />
    <Contact />
  </>
);

function AdminRoute() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('pesante_admin_logged_in') === 'yes');
  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('pesante_admin_logged_in');
    setLoggedIn(false);
  };
  if (!loggedIn) return <Login onLogin={handleLogin} />;
  return (
    <div style={{position:'relative'}}>
      <AdminPortal />
      <div style={{display:'flex',justifyContent:'center',marginTop:32}}>
        <button onClick={handleLogout} style={{background:'#e9e4d5',color:'#7c9a6d',border:'none',borderRadius:6,padding:'0.7rem 2rem',fontWeight:600,fontSize:'1.1rem',cursor:'pointer'}}>Logout</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="pesante-root">
      <PropertiesProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/admin" element={<AdminRoute />} />
          </Routes>
        </Router>
        <Footer />
      </PropertiesProvider>
    </div>
  );
}

export default App;
