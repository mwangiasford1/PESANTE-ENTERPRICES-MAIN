import pesanteLogo from '../assets/images/pesante-logo.jpg';
import './Hero.css';
import { useState, useEffect, useRef } from 'react';

const COMPANY_NAME =          '  PESANTE ENTERPRICE';

const Hero = () => {
  const [displayed, setDisplayed] = useState('');
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function startAnimation() {
      setDisplayed('');
      let i = 0;
      intervalRef.current = setInterval(() => {
        setDisplayed((prev) =>
          i < COMPANY_NAME.length ? prev + COMPANY_NAME[i] : prev
        );
        i++;
        if (i >= COMPANY_NAME.length) {
          clearInterval(intervalRef.current);
          timeoutRef.current = setTimeout(startAnimation, 10000); // 10s delay
        }
      }, 90);
    }
    startAnimation();
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <img
          src={pesanteLogo}
          alt="Pesante Company Logo"
          className="rotating-logo"
          style={{
            height: '150px',
            marginBottom: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderRadius: '50%',
            padding: '16px',
          }}
        />
        <h1 className="company-title">{displayed}</h1>
        <p className="tagline">Building Value. Managing Growth. Marketing Land.</p>
      </div>
    </section>
  );
};

export default Hero; 