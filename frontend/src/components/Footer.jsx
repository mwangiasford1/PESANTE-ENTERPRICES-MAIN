import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div>
      &copy; {new Date().getFullYear()} Pesante Enterprises. All rights reserved.
    </div>
  </footer>
);

export default Footer; 