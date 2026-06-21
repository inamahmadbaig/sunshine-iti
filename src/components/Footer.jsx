import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Footer({ t }) {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();
  const lastUpdated = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="footer-section">

      {/* Upper Footer */}
      <div className="upper-footer">
        <div className="container footer-grid">

          {/* Column 1: Important Links */}
          <div className="footer-col" id="admissions">
            <h4>{t.impLinks}</h4>
            <ul className="footer-links">
              <li><Link to="/"><span className="footer-arrow">›</span> {t.home}</Link></li>
              <li><Link to="/about"><span className="footer-arrow">›</span> {t.about}</Link></li>
              <li><Link to="/trades"><span className="footer-arrow">›</span> {t.trades}</Link></li>
              <li><Link to="/admissions"><span className="footer-arrow">›</span> {t.admissions}</Link></li>
              <li><Link to="/placements"><span className="footer-arrow">›</span> {t.placement}</Link></li>
              <li><Link to="/contact"><span className="footer-arrow">›</span> {t.contact}</Link></li>
            </ul>
          </div>

          {/* Column 2: Contact Address */}
          <div className="footer-col" id="contact">
            <h4>{t.contactAddress}</h4>
            <ul className="contact-address-list">
              <li>
                <MapPin />
                <span>{t.location}</span>
              </li>
              <li>
                <Phone />
                <span>+91-7415491034</span>
              </li>
              <li>
                <Mail />
                <span>sunshineiti8@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Website Policies & Visitor Count */}
          <div className="footer-col">
            <h4>{t.webPolicies}</h4>
            <ul className="footer-links" style={{ marginBottom: '1.5rem' }}>
              <li><Link to="/policies/terms"><span className="footer-arrow">›</span> Terms of Use</Link></li>
              <li><Link to="/policies/privacy"><span className="footer-arrow">›</span> Privacy Policy</Link></li>
              <li><Link to="/policies/hyperlinking"><span className="footer-arrow">›</span> Hyperlinking Policy</Link></li>
              <li><Link to="/policies/copyright"><span className="footer-arrow">›</span> Copyright Policy</Link></li>
              <li><Link to="/policies/accessibility"><span className="footer-arrow">›</span> Accessibility Statement</Link></li>
            </ul>


          </div>

          {/* Column 4: Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="https://ncvtmis.gov.in" target="_blank" rel="noopener noreferrer">
                  <span className="footer-arrow">›</span> NCVT MIS Portal
                  <ExternalLink size={11} style={{ marginLeft: '4px', opacity: 0.6, verticalAlign: 'middle' }} />
                </a>
              </li>
              <li>
                <a href="https://mpskills.gov.in" target="_blank" rel="noopener noreferrer">
                  <span className="footer-arrow">›</span> Directorate of Skill Dev (M.P.)
                  <ExternalLink size={11} style={{ marginLeft: '4px', opacity: 0.6, verticalAlign: 'middle' }} />
                </a>
              </li>
              <li>
                <a href="https://dget.nic.in" target="_blank" rel="noopener noreferrer">
                  <span className="footer-arrow">›</span> DGET Web Portal
                  <ExternalLink size={11} style={{ marginLeft: '4px', opacity: 0.6, verticalAlign: 'middle' }} />
                </a>
              </li>
              <li>
                <a href="https://www.mpsos.nic.in" target="_blank" rel="noopener noreferrer">
                  <span className="footer-arrow">›</span> SCVT Exam Results
                  <ExternalLink size={11} style={{ marginLeft: '4px', opacity: 0.6, verticalAlign: 'middle' }} />
                </a>
              </li>
              <li>
                <Link to="/admissions">
                  <span className="footer-arrow">›</span> Admission Guidelines
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Lower Footer (Our Location) */}
      <div className="lower-footer">
        <div className="container">

          {/* Decorative Title */}
          <div className="location-title-row">
            <span className="location-divider-line"></span>
            <h3 className="location-title-text">OUR LOCATION</h3>
            <span className="location-divider-line"></span>
          </div>

          <div className="location-layout">

            {/* Google Map Embedded */}
            <div className="map-wrapper">
              <iframe
                title="Sunshine ITI College Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.905!2d79.555284!3d22.096317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a27e9b0ec3f4a67%3A0x5b2a3d4e6f7c8d9e!2sKuldevi%20Marhai%20Mata%20Mandir%2C%20Barapatthar%2C%20Seoni%2C%20Madhya%20Pradesh%20480661!5e0!3m2!1sen!2sin!4v1718462000000!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Redesigned Contact Card */}
            <div className="contact-card-new">

              {/* Header: Icon + Name + Address */}
              <div className="contact-card-header">
                <div className="contact-icon-circle">
                  <MapPin size={18} />
                </div>
                <div className="contact-card-address">
                  <h5>Sunshine ITI College</h5>
                  <p>Kuldevi Marhai Mata Mandir, Barapatthar,<br />Seoni, Madhya Pradesh - 480661</p>
                </div>
              </div>

              {/* Phone */}
              <div className="contact-info-row">
                <Phone size={15} className="contact-info-icon" />
                <span>+91-7415491034</span>
              </div>

              {/* Email */}
              <div className="contact-info-row">
                <Mail size={15} className="contact-info-icon" />
                <span>sunshineiti8@gmail.com</span>
              </div>

              {/* Get Directions Button */}
              <a
                href="https://www.google.com/maps?q=22.096317,79.555284"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-get-directions"
              >
                <ExternalLink size={16} style={{ marginRight: '8px' }} />
                {t.getDirections}
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bottom-bar">
        <div className="container bottom-bar-content">
          <div>© 2026 Sunshine ITI College. All Rights Reserved.</div>
          <div>
            Designed &amp; Developed by{' '}
            <span style={{ color: '#f97316', fontWeight: 700 }}>Sunshine IT Team &amp; Inam Ahmad Baig</span>
            {' '}| Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

    </footer>
  );
}
