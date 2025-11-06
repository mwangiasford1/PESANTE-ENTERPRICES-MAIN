// App.jsx
import './App.css';
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Appointment from './components/Appointment';
import Properties from './components/Properties';
import AdminPortal from './components/AdminPortal';
import Dashboard from './components/Dashboard';
import { PropertiesProvider } from './components/PropertiesContext';
import Login from './components/Login';
import Footer from './components/Footer';

// Create Auth Context
const AuthContext = createContext();

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useContext(AuthContext);

  const handleNav = (section) => {
    setOpen(false);
    navigate('/', { state: { scrollTo: section } });
  };

  return (
    <nav className="navbar">
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={open ? 'open' : ''}>
        <li><button className="nav-btn" onClick={() => handleNav(null)}>Home</button></li>
        <li><button className="nav-btn" onClick={() => handleNav('services')}>Services</button></li>
        <li><button className="nav-btn" onClick={() => handleNav('about')}>About</button></li>
        <li><button className="nav-btn" onClick={() => handleNav('contact')}>Contact</button></li>
        <li><Link className="nav-btn" to="/properties" onClick={() => setOpen(false)}>Properties</Link></li>
        <li><Link className="nav-btn" to="/appointment" onClick={() => setOpen(false)}>Appointment</Link></li>
        <li><Link className="nav-btn" to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link></li>
        {isAdminLoggedIn && (
          <li><Link className="nav-btn" to="/admin" onClick={() => setOpen(false)}>Admin Portal</Link></li>
        )}
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
    const section = location.state?.scrollTo;
    if (section === 'services') servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'about') aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'contact') contactRef.current?.scrollIntoView({ behavior: 'smooth' });
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

const AdminRoute = () => {
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useContext(AuthContext);

  const handleLogin = () => {
    localStorage.setItem('pesante_admin_logged_in', 'yes');
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('pesante_admin_token');
    localStorage.removeItem('pesante_admin_logged_in');
    setIsAdminLoggedIn(false);
  };

  return !isAdminLoggedIn ? (
    <Login onLogin={handleLogin} />
  ) : (
    <div style={{ position: 'relative' }}>
      <AdminPortal />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <button
          onClick={handleLogout}
          style={{
            background: '#e9e4d5',
            color: '#7c9a6d',
            border: 'none',
            borderRadius: '6px',
            padding: '0.7rem 2rem',
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() =>
    localStorage.getItem('pesante_admin_logged_in') === 'yes'
  );

  return (
    <AuthContext.Provider value={{ isAdminLoggedIn, setIsAdminLoggedIn }}>
      <div className="pesante-root">
        <PropertiesProvider>
          <Router>
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminRoute />} />
              </Routes>
            </div>
            <Footer />
          </Router>
        </PropertiesProvider>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
