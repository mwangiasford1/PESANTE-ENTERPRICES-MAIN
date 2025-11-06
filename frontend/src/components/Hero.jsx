import pesanteLogo from '../assets/images/pesante-logo.jpg';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <img
          src={pesanteLogo}
          alt="Pesante Company Logo"
          className="logo fade-in"
        />
        <h1 className="company-title">PESANTE ENTERPRISES</h1>
        <p className="tagline">Building Value. Managing Growth. Marketing Land.</p>
      </div>
    </section>
  );
};

export default Hero;
