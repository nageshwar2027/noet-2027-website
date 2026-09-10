import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><strong>Prof. Paidinaidu Paluri (Convener)</strong><br/>
          naidu@iitism.ac.in | +91-9471192195</p>
          <p><strong>Prof. Arunkumar Samanta (Co-Convener)</strong><br/>
          asamanta@iitism.ac.in | +91-9471192213</p>
          <p><strong>Prof. Lutukurthi D N V V Konda (Co-Convener)</strong><br/>
          dnvvkonda@iitism.ac.in | +91-9471192194</p>
        </div>
        <div className="footer-section">
          <h3>Conference Correspondence</h3>
          <p><strong>NOET-2027 Secretariat</strong><br/>n0et@iitism.ac.in</p>
          <p><a href="https://www.iitism.ac.in/chemical-engineering-home" target="_blank" rel="noopener noreferrer">Department of Chemical Engineering ↗</a></p>
        </div>
        <div className="footer-section">
          <h3>Venue</h3>
          <p>Department of Chemical Engineering<br/>
          IIT (ISM) Dhanbad<br/>
          Jharkhand, India</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026-2027 NOET Conference. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
