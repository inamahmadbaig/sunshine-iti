import React from 'react';
import { Award } from 'lucide-react';

export default function Header({ t }) {
  return (
    <header className="main-header">
      <div className="container header-content">
        <div className="header-left">
          <img src="/logo.jpg" alt="Sunshine Logo" className="logo-circle" style={{ objectFit: 'cover' }} />
          <div className="title-section">
            <h1>{t.title}</h1>
            <p>{t.tagline}</p>
          </div>
        </div>
        <div className="header-right">
          <div className="mis-code">{t.mis}</div>
          <div className="skill-india-badge">
            <Award size={18} /> Skill India
          </div>
        </div>
      </div>
    </header>
  );
}
