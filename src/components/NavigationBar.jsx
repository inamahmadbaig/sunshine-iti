import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function NavigationBar({ t, setShowApplyModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRouteForSection = (sectionId) => {
    if (sectionId === 'home') return '/';
    if (sectionId === 'about') return '/about';
    if (sectionId === 'trades') return '/trades';
    if (sectionId === 'admissions') return '/admissions';
    if (sectionId === 'placements') return '/placements';
    if (sectionId === 'contact') return '/contact';
    if (sectionId === 'gallery') return '/gallery';
    if (sectionId === 'student-portal') return '/student-login';
    return '/';
  };

  const handleApply = (e) => {
    setMobileMenuOpen(false);
    setShowApplyModal(true);
  };

  const navItems = [
    { label: t.home, sectionId: 'home' },
    { label: t.trades, sectionId: 'trades' },
    { label: t.admissions, sectionId: 'admissions' },
    { label: t.placement, sectionId: 'placements' },
    { label: 'Gallery', sectionId: 'gallery' },
    { label: t.about, sectionId: 'about' },
    { label: t.contact, sectionId: 'contact' },
  ];

  return (
    <nav className="nav-bar">
      <div className="container nav-content">
        {/* Mobile hamburger toggle */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'nav-links--open' : ''}`}>
          {navItems.map((item) => {
            const route = getRouteForSection(item.sectionId);
            return (
              <li key={item.sectionId}>
                <NavLink
                  to={route}
                  className={({ isActive }) =>
                    location.pathname === route
                      ? 'nav-link nav-link--active'
                      : 'nav-link'
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
          {/* Mobile action buttons inside dropdown */}
          <li className="nav-action-mobile">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <NavLink
                to="/pay-fee"
                className="btn w-100"
                style={{ backgroundColor: '#10b981', color: 'white', display: 'flex', justifyContent: 'center' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pay Fee
              </NavLink>
              <NavLink
                to="/student-login"
                className="btn w-100"
                style={{ backgroundColor: '#3b82f6', color: 'white', display: 'flex', justifyContent: 'center' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Student Login
              </NavLink>
              <NavLink
                to="/apply"
                className="btn btn-primary w-100"
                style={{ display: 'flex', justifyContent: 'center' }}
                onClick={handleApply}
              >
                {t.applyNow}
              </NavLink>
            </div>
          </li>
        </ul>

        {/* Desktop action buttons */}
        <div className="nav-action-desktop">
          <NavLink
            to="/pay-fee"
            className="btn nav-apply-btn"
            style={{ backgroundColor: '#10b981', color: 'white' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Pay Fee
          </NavLink>
          <NavLink
            to="/student-login"
            className="btn nav-apply-btn"
            style={{ backgroundColor: '#3b82f6', color: 'white' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Student Login
          </NavLink>
          <NavLink
            to="/apply"
            className="btn btn-primary nav-apply-btn"
            onClick={handleApply}
          >
            {t.applyNow}
          </NavLink>
        </div>
      </div>
      
      {/* Highlighted Mobile Action Bar - Visible without clicking 3 dots */}
      <div className="mobile-highlight-bar">
        <NavLink to="/pay-fee" className="mobile-highlight-btn" style={{backgroundColor: '#10b981'}}>
          Pay Fee
        </NavLink>
        <NavLink to="/student-login" className="mobile-highlight-btn" style={{backgroundColor: '#3b82f6'}}>
          Student Login
        </NavLink>
        <button onClick={handleApply} className="mobile-highlight-btn" style={{backgroundColor: '#f97316', border: 'none', cursor: 'pointer', fontFamily: 'inherit'}}>
          {t.applyNow}
        </button>
      </div>
    </nav>
  );
}
