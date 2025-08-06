import pesanteLogo from '../assets/images/pesante-logo.jpg';
import './Hero.css';
import { useState, useEffect, useRef } from 'react';

const COMPANY_NAME = '  PESANTE ENTERPRISES';

const Hero = () => {
  const [displayed, setDisplayed] = useState('');
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const animateText = () => {
    let i = 0;
    setDisplayed('');
    intervalRef.current = setInterval(() => {
      setDisplayed((prev) =>
        i < COMPANY_NAME.length ? prev + COMPANY_NAME[i] : prev
      );
      i++;
      if (i >= COMPANY_NAME.length) {
        clearInterval(intervalRef.current);
        timeoutRef.current = setTimeout(animateText, 10000);
      }
    }, 90);
  };

  useEffect(() => {
    animateText();
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
          className="logo fade-in"
        />
        <h1 className="company-title">{displayed}</h1>
        <p className="tagline">Building Value. Managing Growth. Marketing Land.</p>
      </div>
    </section>
  );
};

export default Hero;
