import React from 'react';
import { Phone, Mail, Award } from 'lucide-react';

export default function TopBar({ t, setBaseFontSize, setShowAdminModal, setLang, lang }) {
  return (
    <div className="top-bar">
      <div className="container top-bar-content">
        <div className="top-bar-left">
          <span><Phone size={14} /> {t.phone}: +91-7415491034</span>
          <span><Mail size={14} /> {t.email}: sunshineiti8@gmail.com</span>
        </div>
        <div className="top-bar-right">
          <span className="badge badge-green">
            <Award size={12} style={{ marginRight: '2px', display: 'inline' }} /> {t.ncvt}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <button className="resizer-btn" onClick={() => setBaseFontSize(14)}>A-</button>
            <button className="resizer-btn" onClick={() => setBaseFontSize(16)}>A</button>
            <button className="resizer-btn" onClick={() => setBaseFontSize(18)}>A+</button>
          </div>
          <button className="btn-admin" onClick={() => setShowAdminModal(true)}>{t.admin}</button>
          <button className="lang-btn active" onClick={() => setLang(lang === 'EN' ? 'HN' : 'EN')}>{t.lang}</button>
        </div>
      </div>
    </div>
  );
}
