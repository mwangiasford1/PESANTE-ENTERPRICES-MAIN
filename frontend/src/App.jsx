import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Appointment from './components/Appointment';
import Properties from './components/Properties';
import AdminPortal from './components/AdminPortal';
import { PropertiesProvider } from './components/PropertiesContext';
import Login from './components/Login';
import React, { useState, useEffect, useRef } from 'react';
import Footer from './components/Footer';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleNav = (section) => {
    setOpen(false);
    if (section) {
      navigate('/', { state: { scrollTo: section } });
    } else {
      navigate('/');
    }
  };
  return (
    <nav className="navbar">
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={open ? 'open' : ''}>
        <li><button className="nav-btn" onClick={() => handleNav()}>Home</button></li>
        <li><button className="nav-btn" onClick={() => handleNav('services')}>Services</button></li>
        <li><button className="nav-btn" onClick={() => handleNav('about')}>About</button></li>
        <li><button className="nav-btn" onClick={() => handleNav('contact')}>Contact</button></li>
        <li><Link className="nav-btn" to="/properties" onClick={() => setOpen(false)}>Properties</Link></li>
        <li><Link className="nav-btn" to="/appointment" onClick={() => setOpen(false)}>Appointment</Link></li>
        {/* <li><Link to="/admin">Admin Portal</Link></li> */}
      </ul>
    </nav>
  );
};

const Home = () => {
  const location = useLocation();
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const section = location.state.scrollTo;
      if (section === 'services' && servicesRef.current) servicesRef.current.scrollIntoView({ behavior: 'smooth' });
      if (section === 'about' && aboutRef.current) aboutRef.current.scrollIntoView({ behavior: 'smooth' });
      if (section === 'contact' && contactRef.current) contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <>
      <Hero />
      <div ref={servicesRef}><Services /></div>
      <div ref={aboutRef}><About /></div>
      <div ref={contactRef}><Contact /></div>
    </>
  );
};

function AdminRoute() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('pesante_admin_logged_in') === 'yes');
  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('pesante_admin_token');
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
