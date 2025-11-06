import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <p>&copy; {new Date().getFullYear()} Pesante Enterprises. All rights reserved.</p>
      <p>Building Value. Managing Growth. Marketing Land.</p>
    </div>
  </footer>
);

export default Footer; 